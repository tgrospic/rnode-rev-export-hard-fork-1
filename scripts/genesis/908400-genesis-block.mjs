import R from 'ramda'
import { test } from 'tap'
import { readOrDownloadFile, parseStakeFromBlock, parseRevWalletsFromBlock, parseRevWallets, mintedREVs, C } from '../common/index.mjs'

test('genesis 908400 block wallets (after Hard Fork 1)', async t => {
  const genesisBlockUrl  = `https://observer-eu.services.mainnet.rchain.coop/api/block/4628fd789319c66a42d228fe3c87dcc822732a1d6c726d829870570edb372d05`
  const genesisBlockFile = `data/genesis-908400-block-raw.json`

  const walletsFileUrl = `https://raw.githubusercontent.com/rchain/rchain/1c4f83896a09d06a08fcbc19e3534bf7debe84c9/wallets.txt`
  const walletsFile    = `data/genesis-908400-wallets-file.txt`

  // Load genesis block
  const blockContent = await readOrDownloadFile(genesisBlockUrl, genesisBlockFile)

  // Load wallets file
  const walletsText = await readOrDownloadFile(walletsFileUrl, walletsFile)

  // Parse REV address and amount from deploys Rholang terms (transfers)
  const [blockWallets] = parseRevWalletsFromBlock(blockContent)

  // Parse ETH address and amount from each line
  const [fileWallets] = parseRevWallets(walletsText)

  // Parse bonds map - validators stake
  const [stakes] = parseStakeFromBlock(blockContent)

  // Calculate total REVs as sum of all wallets
  const totalBlock = R.reduce((acc, [,rev]) => acc + rev, 0n, blockWallets)

  // Calculate total REVs as sum of all wallets
  const totalFile = R.reduce((acc, [,rev]) => acc + rev, 0n, fileWallets)

  // Calculate total stake
  const totalStake = R.reduce((acc, [,rev]) => acc + rev, 0n, stakes)

  console.log(`${C.BLUE}Genesis 908400 block and wallets file validation${C.NC}`)

  console.log(`Minted REVs: ${C.GREEN}${mintedREVs}${C.NC} <-- created in genesis 0 block`)

  t.same(blockWallets.length, fileWallets.length, `Wallets count should be the same from block and wallets file`)
  console.log(`Count      : ${C.GREEN}${blockWallets.length}${C.NC}`)

  t.same(totalBlock, totalFile, `Total wallets should be the same from block and file`)
  console.log(`Total      : ${C.GREEN}${totalBlock}${C.NC}`)

  console.log(`Total stake: ${C.GREEN}${totalStake}${C.NC}`)

  const mainNetRevs = mintedREVs - totalStake
  console.log(`Expected   : ${C.GREEN}${mintedREVs} - ${totalStake}${C.NC}`)

  const diffFromNow = totalBlock - mainNetRevs
  console.log(`Diff       : ${C.RED}${diffFromNow}${C.NC} <-- Extra REVs from bonds map (total stake)`)

  t.notSame(totalBlock, mainNetRevs, `Genesis REVs should be equal to current REVs`)
})
