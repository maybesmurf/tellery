import { getRepository } from 'typeorm'
import BlockEntity from '../../entities/block'
import { CyclicTransclusionError, NotFoundError } from '../../error/error'
import { BlockType } from '../../types/block'
import { DirectedGraph } from '../../utils/directedgraph'
import { sqlMacro, SQLPieces } from '../../utils/sql'
import { QuestionBlock } from '../block/question'

/**
* This is the default translator, its matching priority is the lowest. It will match all that is not matched by other Translator
 */
function match() : boolean {
  return true
}

/**
 * Assist param to an executable statement
 */
async function translate(sql: string): Promise<string> {
  const graph = new DirectedGraph<SQLPieces>()

  // build directed graph
  await buildGraph('root', sql, graph)

  // check if the graph is valid
  if (graph.isCyclic('root')) {
    throw CyclicTransclusionError.new()
  }

  return buildSqlFromGraph('root', graph)
}

async function loadSqlFromBlock(blockId: string): Promise<string> {
  const blockRecord = await getRepository(BlockEntity).findOne({
    id: blockId,
    alive: true,
    type: BlockType.QUESTION,
  })

  if (!blockRecord) {
    throw NotFoundError.resourceNotFound(blockId)
  }
  const block = QuestionBlock.fromEntity(blockRecord) as QuestionBlock

  return block.getSql()
}

async function buildGraph(
  key: string,
  sql: string,
  currentGraph: DirectedGraph<SQLPieces, string>,
) {
  const currentNode = sqlMacro(sql)
  currentGraph.addNode(key, currentNode)
  await Promise.all(
    currentNode.subs.map(async ({ blockId }) => {
      currentGraph.addEdge(key, blockId)
      if (!currentGraph.hasNode(blockId)) {
        const subSql = await loadSqlFromBlock(blockId)
        await buildGraph(blockId, subSql, currentGraph)
      }
    }),
  )
}

function buildSqlFromGraph(rootKey: string, graph: DirectedGraph<SQLPieces, string>): string {
  const { subs, mainBody } = graph.getNode(rootKey)

  const commonTableExprs = subs.map(({ blockId, alias }) => {
    const cteBody = buildSqlFromGraph(blockId, graph)
    return `  ${alias} AS (\n    ${cteBody.replace(/\n/g, '\n    ')}\n  )`
  })

  if (commonTableExprs.length === 0) {
    return mainBody
  }

  // remove leading space and newlines, for further check
  const polishedMainBody = mainBody.trim()

  // compatible with `with recursive clause` in main body
  if (polishedMainBody.toLowerCase().startsWith('with recursive')) {
    return `WITH RECURSIVE \n${commonTableExprs.join(',\n')},\n${polishedMainBody.substring(15)}`
  }

  const commonTableExprBody = `WITH\n${commonTableExprs.join(',\n')}`
  // compatible with `with clause` in main body
  if (polishedMainBody.toLowerCase().startsWith('with ')) {
    return `${commonTableExprBody},\n${polishedMainBody.substring(5)}`
  }
  return `${commonTableExprBody}\n${polishedMainBody}`
}

export { match, translate }
