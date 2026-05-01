import { useEffect, useState, memo } from 'react'
import { Link, useLocation } from 'react-router-dom'
import Logo from './Logo'

const Navbar = memo(function Navbar({ leftContent, rightContent }) {
  const location = useLocation()
  const [isMobile, setIsMobile] = useState(false)
  
  // Track viewport safely
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Logo is always the same — hardcoded so it never unmounts across pages
  const StableLogo = (
    <Link to="/" className="flex items-center justify-center pointer-events-auto hover:scale-[1.03] active:scale-[0.97] transition-transform duration-300">
      <Logo variant="white" className="h-[2rem] md:h-[2.2rem] object-contain drop-shadow-[0_2px_12px_rgba(255,255,255,0.2)]" />
    </Link>
  )

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-[1000] mx-auto pointer-events-auto bg-black transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)]"
      style={{
        boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
        borderBottomLeftRadius: '1.5rem',
        borderBottomRightRadius: '1.5rem',
        width: 'fit-content', 
        minWidth: '180px',
      }}
    >
      {/* SVG Ears to create the Notch look */}
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="absolute top-0 -left-[23px] pointer-events-none z-10">
        <path d="M24 0H0C13.2548 0 24 10.7452 24 24V0Z" fill="black" />
      </svg>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="absolute top-0 -right-[23px] pointer-events-none z-10">
        <path d="M0 0H24C10.7452 0 0 10.7452 0 24V0Z" fill="black" />
      </svg>

      <div className="flex items-center justify-center pt-2 pb-3 px-3 h-full">
        
        {/* Left Content Wrapper */}
        <div 
          className="overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] flex items-center justify-end"
          style={{
            maxWidth: leftContent ? '400px' : '0px',
            opacity: leftContent ? 1 : 0,
          }}
        >
          <div className="whitespace-nowrap flex items-center pr-6 pl-1">
            {leftContent}
          </div>
        </div>
        
        {/* Center Logo */}
        <div className="shrink-0 flex items-center justify-center px-4">
          {StableLogo}
        </div>

        {/* Right Content Wrapper */}
        <div 
          className="overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] flex items-center justify-start"
          style={{
            maxWidth: rightContent ? '400px' : '0px',
            opacity: rightContent ? 1 : 0,
          }}
        >
          <div className="whitespace-nowrap flex items-center pl-6 pr-1">
            {rightContent}
          </div>
        </div>

      </div>
    </nav>
  )
})

export default Navbar
