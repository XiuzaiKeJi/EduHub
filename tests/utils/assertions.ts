import { screen } from '@testing-library/react'

/**
 * 测试断言工具
 */
export class TestAssertions {
  /**
   * 断言元素存在
   */
  static assertElementExists(testId: string) {
    expect(screen.getByTestId(testId)).toBeInTheDocument()
  }

  /**
   * 断言元素包含文本
   */
  static assertElementContainsText(testId: string, text: string) {
    expect(screen.getByTestId(testId)).toHaveTextContent(text)
  }

  /**
   * 断言元素可见
   */
  static assertElementVisible(testId: string) {
    expect(screen.getByTestId(testId)).toBeVisible()
  }
} 