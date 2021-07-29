import { sqlRequest } from '@app/api'
import { useWorkspace } from '@app/hooks/useWorkspace'
import { createTranscation } from '@app/context/editorTranscations'
import dayjs from 'dayjs'
import invariant from 'tiny-invariant'
import { nanoid } from 'nanoid'
import React, { useCallback, useContext, useEffect, useMemo } from 'react'
import { useIsMutating, useQueryClient } from 'react-query'
import { applyCreateSnapshotOperation } from '@app/store/block'
import type { Editor, Story } from '@app/types'
import { useCommit } from './useCommit'
import { useStoryBlocksMap } from './useStoryBlock'
import { isQuestionLikeBlock } from '@app/components/editor/Blocks/utils'

export const useRefreshSnapshot = () => {
  const commit = useCommit()
  const workspace = useWorkspace()
  const queryClient = useQueryClient()

  const execute = useCallback(
    (questionBlock: Editor.QuestionBlock) => {
      const originalBlockId = questionBlock.id
      const sql = questionBlock.content?.sql ?? ''
      const mutationCount = queryClient
        .getMutationCache()
        .getAll()
        .filter(
          (mutation) =>
            (mutation.options.mutationKey as string)?.endsWith(originalBlockId) && mutation.state.status === 'loading'
        ).length

      if (mutationCount >= 1) return

      queryClient.executeMutation({
        mutationFn: sqlRequest,
        variables: {
          workspaceId: workspace.id,
          sql,
          questionId: originalBlockId,
          connectorId: workspace.preferences.connectorId!,
          profile: workspace.preferences.profile!
        },
        mutationKey: ['story', questionBlock.storyId, questionBlock.id, originalBlockId].join('/'),
        onSuccess: async (data) => {
          if (typeof data !== 'object' || data.errMsg) {
            // const snapshotId = questionBlock.content!.snapshotId
            commit({
              storyId: questionBlock.storyId!,
              transcation: createTranscation({
                operations: [
                  {
                    cmd: 'update',
                    id: originalBlockId,
                    path: ['content', 'lastRunAt'],
                    table: 'block',
                    args: Date.now()
                  },
                  {
                    cmd: 'update',
                    id: originalBlockId,
                    path: ['content', 'error'],
                    table: 'block',
                    args: data.errMsg ?? data
                  }
                ]
              })
            })
            return
          }
          const snapshotId = nanoid()
          await applyCreateSnapshotOperation({
            snapshotId,
            questionId: originalBlockId,
            sql: sql,
            data: data,
            workspaceId: workspace.id
          })
          commit({
            storyId: questionBlock.storyId!,
            transcation: createTranscation({
              operations: [
                {
                  cmd: 'update',
                  id: originalBlockId,
                  path: ['content', 'lastRunAt'],
                  table: 'block',
                  args: Date.now()
                },
                {
                  cmd: 'update',
                  id: originalBlockId,
                  path: ['content', 'error'],
                  table: 'block',
                  args: ''
                },
                {
                  cmd: 'update',
                  id: originalBlockId,
                  path: ['content', 'snapshotId'],
                  table: 'block',
                  args: snapshotId
                }
              ]
            })
          })
        }
      })
    },
    [commit, queryClient, workspace.id, workspace.preferences.connectorId, workspace.preferences.profile]
  )

  const cancel = useCallback(
    (blockId) => {
      const mutations = queryClient.getMutationCache().getAll()
      mutations
        .filter((mutation) => (mutation.options.mutationKey as string)?.endsWith(blockId))
        .forEach((mutation) => {
          queryClient.getMutationCache().remove(mutation)
        })
      // executeSQL.reset()
    },
    [queryClient]
  )

  const snapshotMutation = useMemo<SnapshotMutation>(
    () => ({
      execute,
      cancel
    }),
    [cancel, execute]
  )

  return snapshotMutation
}

export const useStorySnapshotManagerProvider = (storyId: string) => {
  const storyBlocksMap = useStoryBlocksMap(storyId)

  const questionBlocks = useMemo(() => {
    if (!storyBlocksMap) return []
    return Object.values(storyBlocksMap).filter((block) => isQuestionLikeBlock(block.type))
  }, [storyBlocksMap])

  const refreshOnInit = (storyBlocksMap?.[storyId] as Story)?.format?.refreshOnOpen
  const refreshSnapshot = useRefreshSnapshot()

  useEffect(() => {
    if (refreshOnInit) {
      questionBlocks.forEach((questionBlock: Editor.QuestionBlock) => {
        if (dayjs().diff(dayjs(questionBlock.content?.lastRunAt ?? 0)) > 1000 * 5 * 60) {
          refreshSnapshot.execute(questionBlock)
        }
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshOnInit, refreshSnapshot])

  const runAll = useCallback(() => {
    questionBlocks.forEach((questionBlock: Editor.QuestionBlock) => {
      refreshSnapshot.execute(questionBlock)
    })
  }, [questionBlocks, refreshSnapshot])

  const cancelAll = useCallback(() => {
    questionBlocks.forEach((questionBlock: Editor.QuestionBlock) => {
      refreshSnapshot.cancel(questionBlock.id)
    })
  }, [questionBlocks, refreshSnapshot])

  const refreshingSnapshot = useIsMutating({
    predicate: (mutation) => (mutation.options.mutationKey as string)?.startsWith(`story/${storyId}`)
  })

  return useMemo(
    () => ({
      total: questionBlocks.length,
      mutating: refreshingSnapshot,
      runAll,
      cancelAll
    }),
    [cancelAll, questionBlocks.length, refreshingSnapshot, runAll]
  )
}

export const StorySnapshotMangerContext = React.createContext<ReturnType<
  typeof useStorySnapshotManagerProvider
> | null>(null)

export const useStorySnapshotManager = () => {
  const context = useContext(StorySnapshotMangerContext)
  invariant(context, 'useBlockTranscations must use in provider')
  return context
}

export const useSnapshotMutating = (originalBlockId: string) => {
  const refreshingSnapshot = useIsMutating({
    predicate: (mutation) => (mutation.options.mutationKey as string)?.endsWith(originalBlockId)
  })

  return refreshingSnapshot
}

export interface SnapshotMutation {
  execute: (questionBlock: Editor.QuestionBlock) => void
  cancel: (blockId: string) => void
}
