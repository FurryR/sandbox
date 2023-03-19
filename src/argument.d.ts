interface ArgumentMap {
  string: string
  Boolean: boolean
}
type ArgumentType = keyof ArgumentMap
interface Argument<T extends ArgumentType = ArgumentType> {
  type: T
  defaultValue?: ArgumentMap[T]
}
type CommonBlock = {
  opcode: string
  arguments: {
    [key: string]: Argument
  }
}
interface BlockMap {
  button: {
    onClick: () => void
  }
  reporter: CommonBlock
  Boolean: CommonBlock
}
type BlockType = keyof BlockMap
interface _BaseBlockInfo<T extends BlockType> {
  blockType: T
  text: string
}
export type BlockInfo<T extends BlockType = BlockType> = _BaseBlockInfo<T> &
  BlockMap[T]
