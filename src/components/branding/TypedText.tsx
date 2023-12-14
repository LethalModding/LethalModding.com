import { useEffect, useState } from 'react'

type Props = {
    finalText: string
    initialText?: string
    startDelay?: number
    typingSpeed?: number
}

export default function TypedText(props: Props): JSX.Element {
  const { finalText, initialText = '', startDelay = 0, typingSpeed = 25 } = props

  const [typedText, setTypedText] = useState(initialText)
  const [isTyping, setIsTyping] = useState(false)

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsTyping(true)
    }, startDelay)

    return () => clearTimeout(timeout)
  }, [startDelay])

  useEffect(() => {
    if (!isTyping) return

    const timeout = setTimeout(() => {
      const nextChar = finalText[typedText.length]
      setTypedText(typedText + nextChar)
    }, typingSpeed)

    return () => clearTimeout(timeout)
  }, [typedText, finalText, typingSpeed, isTyping])

  useEffect(() => {
    if (typedText === finalText) {
      setIsTyping(false)
    }
  }, [typedText, finalText])

  return <>{typedText}{isTyping && <span>&#9608;</span>}</>
}
