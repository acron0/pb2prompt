export const addHeading = (headingString: string, depth: number = 2) => (s: Array<string>): Array<string> => {
  return [...s, `${"#".repeat(depth)} ${headingString}`]
}

export const addTitle = (titleString: string) => addHeading(titleString, 1)

export const addParagraph = (paragraphString: string) => (s: Array<string>): Array<string> => {
  return [...s, paragraphString]
}

export const addBulletList = (bulletList: Array<string>) => (s: Array<string>): Array<string> => {
  return [...s, ...bulletList.map((bullet) => `* ${bullet}`)]
}

export const addEmptyLine = () => (s: Array<string>): Array<string> => {
  return [...s, ""]
}
