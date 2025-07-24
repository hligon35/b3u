<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# B3U Podcast Website - Copilot Instructions

## Project Overview
This is a website for the B3U podcast, featuring a retired veteran host who is outspoken, active, and dedicated to giving back to the community. The website is built with modern HTML5, CSS3, and vanilla JavaScript, focusing on performance, accessibility, and SEO optimization.

## Design Philosophy
- **Military-inspired aesthetics**: Use colors like #ff6b35 (orange), #2c3e50 (dark blue-gray), and #0a0a0a (deep black)
- **Bold and professional**: Reflect the host's outspoken personality while maintaining professionalism
- **Community-focused**: Emphasize service, giving back, and veteran support
- **Accessible**: Ensure the site works for all users, including those with disabilities

## Technical Guidelines

### HTML Structure
- Use semantic HTML5 elements for better SEO and accessibility
- Include proper meta tags for social media sharing (Open Graph, Twitter Cards)
- Implement structured data (JSON-LD) for podcast SEO
- Ensure all images have alt text and proper loading attributes

### CSS Styling
- Mobile-first responsive design using CSS Grid and Flexbox
- Use CSS custom properties for consistent theming
- Implement smooth animations and transitions
- Follow BEM methodology for CSS class naming
- Ensure minimum contrast ratios for accessibility (WCAG AA)

### JavaScript Functionality
- Vanilla JavaScript only (no frameworks)
- Progressive enhancement approach
- Implement lazy loading for performance
- Add proper event listeners and error handling
- Include analytics tracking placeholders

### SEO Optimization
- Optimize page titles and meta descriptions
- Use proper heading hierarchy (h1, h2, h3, etc.)
- Implement internal linking strategy
- Add structured data for podcast content
- Optimize for Core Web Vitals

### Content Guidelines
- Write content that reflects the veteran's voice and values
- Include keywords related to veterans, podcasts, community service
- Ensure content is engaging and authentic
- Add calls-to-action that encourage community engagement

### Performance Considerations
- Minimize and compress assets
- Use efficient image formats and sizes
- Implement critical CSS inline
- Add proper caching headers (when applicable)
- Optimize for lighthouse scores

### Accessibility Features
- Keyboard navigation support
- Screen reader compatibility
- Proper ARIA labels and roles
- Color contrast compliance
- Focus indicators for interactive elements

## File Structure
```
/
├── index.html          # Main landing page
├── styles.css          # All styling
├── script.js           # Interactive functionality
├── .github/
│   └── copilot-instructions.md
└── assets/ (future)
    ├── images/
    ├── audio/
    └── icons/
```

## Future Enhancements
When adding new features, consider:
- Podcast RSS feed integration
- Audio player component
- Episode archive with search/filter
- Newsletter signup
- Social media integration
- Community forum or comments
- Veteran resources section
- Guest booking system

## Brand Voice
- Authentic and straightforward
- Respectful but not afraid to speak truth
- Community-oriented
- Professional yet approachable
- Veteran-focused but inclusive

## Color Palette
- Primary: #ff6b35 (Orange - represents energy and action)
- Secondary: #2c3e50 (Dark Blue-Gray - represents stability and trust)
- Background: #0a0a0a (Deep Black - represents strength and focus)
- Text: #ffffff (White), #333333 (Dark Gray)
- Accent: #34495e (Blue-Gray), #f8f9fa (Light Gray)

## Typography
- Headers: 'Oswald' - Strong, military-inspired
- Body: 'Inter' - Clean, readable, modern
- Use appropriate font weights to create hierarchy
- Ensure text is readable at all screen sizes
