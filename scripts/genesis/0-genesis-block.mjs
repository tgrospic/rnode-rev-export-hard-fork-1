import R from 'ramda'
import { test } from 'tap'
import { readOrDownloadFile, parseStakeFromBlock, parseRevWalletsFromBlock, parseEthWallets, mintedREVs, C } from '../common/index.mjs'

test(`${C.BLUE}Genesis 0 block and wallets file validation (main net start)${C.NC}`, async t => {
  const genesisBlockUrl  = `https://obs-prehf1.services.mainnet.rchain.coop/api/block/986addc3dfa12b179eaa40e38d77aec3da0530b9ca2243271436a135055229dd`
  const genesisBlockFile = `data/genesis-0-block-raw.json`

  const walletsFileUrl = `https://raw.githubusercontent.com/rchain/rchain/8cb5d5224ebbad0dd00092583241ab348323450f/wallets.txt`
  const walletsFile    = `data/genesis-0-wallets-file.txt`

  // Load genesis block
  const blockContent = await readOrDownloadFile(genesisBlockUrl, genesisBlockFile)

  // Load wallets file
  const walletsText = await readOrDownloadFile(walletsFileUrl, walletsFile)

  // Parse REV address and amount from deploys Rholang terms (transfers)
  const [blockWallets] = parseRevWalletsFromBlock(blockContent)

  // Parse ETH address and amount from each line
  const [fileWallets] = parseEthWallets(walletsText)

  // Parse bonds map - validators stake
  const [stakes] = parseStakeFromBlock(blockContent)

  // Calculate total REVs as sum of all wallets
  const totalBlock = R.reduce((acc, [,rev]) => acc + rev, 0n, blockWallets)

  // Calculate total REVs as sum of all wallets
  const totalFile = R.reduce((acc, [,rev]) => acc + rev, 0n, fileWallets)

  // Calculate total stake
  const totalStake = R.reduce((acc, [,rev]) => acc + rev, 0n, stakes)

  t.same(blockWallets.length, fileWallets.length, `Wallets count should be the same from block and wallets file`)
  console.log(`Count      : ${C.GREEN}${blockWallets.length}${C.NC}`)

  t.same(totalBlock, totalFile, `Total wallets should be the same from block and file`)
  console.log(`Total      : ${C.GREEN}${totalBlock}${C.NC}`)

  console.log(`Total stake: ${C.GREEN}${totalStake}${C.NC} <-- added to PoS vault on init PoS contract`)

  const totalRevs = totalBlock + totalStake
  console.log(`Minted REVs: ${C.GREEN}${totalRevs}${C.NC}`)

  t.same(mintedREVs, totalRevs, `Genesis REVs should be equal to current REVs`)
})
