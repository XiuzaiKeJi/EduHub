import { render, screen } from '@testing-library/react'
import Footer from '../Footer'

describe('Footer', () => {
  it('renders footer with copyright text', () => {
    render(<Footer />)
    expect(screen.getByText(/©/)).toBeInTheDocument()
    expect(screen.getByText(/All rights reserved/)).toBeInTheDocument()
  })

  it('renders social media links', () => {
    render(<Footer />)
    
    // 检查社交媒体链接
    const githubLink = screen.getByRole('link', { name: /GitHub/i })
    const twitterLink = screen.getByRole('link', { name: /Twitter/i })
    
    expect(githubLink).toBeInTheDocument()
    expect(twitterLink).toBeInTheDocument()
  })

  it('displays current year in copyright text', () => {
    render(<Footer />)
    const currentYear = new Date().getFullYear()
    expect(screen.getByText(new RegExp(currentYear.toString()))).toBeInTheDocument()
  })
}) 