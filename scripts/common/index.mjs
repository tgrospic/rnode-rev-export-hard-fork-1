import * as R from 'ramda'
import fs from 'fs/promises'
import fetch from 'node-fetch'
import { Agent } from 'https'

// REVs created in genesis 0 block / exported totaol of REV balances before Hard Fork 1
export const mintedREVs = 99999999999999995n

export const C = { GREEN: "\x1b[0;32m", BLUE: "\x1b[0;35m", RED: "\x1b[0;31m", NC: "\x1b[0m" }

// Create temp folder
const dataDir = 'data'
await fs.access(dataDir).catch(async _ => fs.mkdir(dataDir))

/**
 * Parse text by line
 *
 * @param parser Parse text by line to tuples
 * @param text Text to parse
 * @returns Array of parsed lines with Map on first element in tuple
 */
export const parseLines = R.curry((lineParser, func, text) => {
  const tuples    = text.matchAll(lineParser)
  const tuplesArr = Array.from(tuples)
  const results   = tuplesArr.map(func)
  const resultMap = new Map(results)

  // Check duplicate keys
  if (results.length !== resultMap.size) {
    console.error(`${C.RED}Lines contains duplicate keys!${C.NC}`)
  }

  return [results, resultMap]
})

/**
 * Read file or download if not found
 */
export const readOrDownloadFile = R.curry(async (url, filePath) =>
  await fs.access(filePath)
    // Read file content
    .then(_ => fs.readFile(filePath, 'utf8'))
    // Or download file and return content
    .catch(async _ => {
      console.log(`File (${filePath}) is not found. Downloading from url ${C.GREEN}${url}${C.NC}`)
      // Download genesis block from full observer node before Hard Fork 1
      const fetchOpt = {
        agent: new Agent({ rejectUnauthorized: false })
      }
      const body = await fetch(url, fetchOpt).then(res => res.text())
      // Write to a file
      await fs.writeFile(filePath, body, 'utf8')

      return body
    })

)

export const parseRevWalletsFromBlock = parseLines(
  /(1111[1-9a-zA-Z]+)[\\", ]+([0-9]+)/gm,
  ([_, addr, rev]) => [addr, BigInt(rev)],
)

export const parseStakeFromBlock = parseLines(
  /validator":"([0-9a-fA-F]+)","stake":([0-9]+)/gm,
  ([_, addr, rev]) => [addr, BigInt(rev)],
)

export const parseRevWallets = parseLines(
  /^([1-9a-zA-Z]+),([0-9]+)/gm,
  ([_, addr, rev]) => [addr, BigInt(rev)],
)

export const parseEthWallets = parseLines(
  /^(0x[0-9a-fA-F]+),([0-9]+)/gm,
  ([_, addr, rev]) => [addr, BigInt(rev)],
)
