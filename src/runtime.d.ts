import type { BlockInfo } from 'argument'
interface TranslationMap {
  [lang: string]: {
    [key: string]: string
  }
}
/**
 * @brief 格式化消息返回的函数类型。
 */
export type FormatMessageType = (args: {
  id: string
  default: string
  description: string
}) => string
export interface Runtime {
  /**
   * @brief 获取格式化消息。
   * @param args 语言表。
   */
  getFormatMessage(args: TranslationMap): FormatMessageType
}
/**
 * @brief 插件的类型描述。
 */
export interface ExtensionInfo {
  id: string /* 扩展 id */
  name: string /* 扩展名 */
  color1?: string /* 颜色 */
  color2?: string /* 颜色2 */
  menuIconURI?: string /* icon */
  blockIconURI?: string /* icon 2 */
  blocks: (BlockInfo | string)[] /* 语句表 */
}
export interface ExportInfo<T> {
  Extension: { new (runtime: Runtime): T }
  info: {
    name: string
    description: string
    extensionId: string
    iconURL: string
    insetIconURL: string
    featured: boolean
    disabled: boolean
    collaborator: string
    doc?: string
  }
  l10n: TranslationMap
}
