# Reusable NativeWind Components

This directory contains reusable UI components built with NativeWind (Tailwind CSS for React Native). These components help maintain consistency across the app and reduce code duplication.

## Components Overview

### Container
A flexible container component for different layout needs.

```tsx
import { Container } from '../components';

// Primary container (default)
<Container variant="primary">
  {/* Your content */}
</Container>

// Centered container
<Container variant="secondary">
  {/* Centered content */}
</Container>

// Card-style container
<Container variant="card">
  {/* Card content */}
</Container>
```

**Variants:**
- `primary`: Standard app background with padding
- `secondary`: Centered layout with app background
- `card`: Card-style background with rounded corners

### Button
Versatile button component with multiple variants and sizes.

```tsx
import { Button } from '../components';

// Primary button (default)
<Button variant="primary" onPress={handlePress}>
  Click Me
</Button>

// Different variants
<Button variant="secondary">Secondary</Button>
<Button variant="outline">Outline</Button>
<Button variant="cancel">Cancel</Button>
<Button variant="logout">Logout</Button>

// Different sizes
<Button size="small">Small</Button>
<Button size="medium">Medium</Button>
<Button size="large">Large</Button>
```

**Variants:**
- `primary`: Pink background (#FF6B9D)
- `secondary`: Teal background (#4ECDC4)
- `outline`: Transparent with gray border
- `cancel`: Gray background
- `logout`: Transparent with border

**Sizes:**
- `small`: Compact padding
- `medium`: Standard padding
- `large`: Generous padding

### Typography
Text component with semantic variants and color options.

```tsx
import { Typography } from '../components';

// Different text variants
<Typography variant="title">App Title</Typography>
<Typography variant="heading">Section Heading</Typography>
<Typography variant="body">Body text</Typography>
<Typography variant="caption">Small caption</Typography>

// Different colors
<Typography color="primary">Pink text</Typography>
<Typography color="secondary">Teal text</Typography>
<Typography color="accent">Yellow text</Typography>
<Typography color="white">White text</Typography>
<Typography color="gray">Gray text</Typography>

// Text styling
<Typography weight="bold" align="center">
  Bold centered text
</Typography>
```

**Variants:**
- `title`: Large title text (5xl)
- `subtitle`: Subtitle text (lg)
- `heading`: Section heading (2xl)
- `body`: Regular body text (base)
- `caption`: Small caption text (sm)
- `button`: Button text size (lg)
- `score`: Large score display (4xl)
- `timer`: Timer display (2xl)

**Colors:**
- `primary`: #FF6B9D (pink)
- `secondary`: #4ECDC4 (teal)
- `accent`: #FFE66D (yellow)
- `white`: White
- `gray`: Gray
- `success`: Green
- `error`: Red

### Card
Card container for grouping related content.

```tsx
import { Card } from '../components';

// Default card
<Card>
  <Typography>Card content</Typography>
</Card>

// Specialized card variants
<Card variant="score">
  <Typography>Score display</Typography>
</Card>

<Card variant="rules">
  <Typography>Game rules</Typography>
</Card>
```

**Variants:**
- `default`: Standard card styling
- `score`: Score display card with center alignment
- `rules`: Rules container
- `result`: Result display card
- `summary`: Summary card with bottom margin

### Input
Text input component with consistent styling.

```tsx
import { Input } from '../components';

// Rounded input (common for login forms)
<Input
  variant="rounded"
  size="large"
  placeholder="Enter text"
  value={value}
  onChangeText={setValue}
/>

// Default input
<Input
  placeholder="Default input"
  value={value}
  onChangeText={setValue}
/>
```

**Variants:**
- `default`: Standard input styling
- `rounded`: Rounded input with center text alignment

**Sizes:**
- `small`: Compact input
- `medium`: Standard input
- `large`: Large input

### Layout
Layout helper component for common layout patterns.

```tsx
import { Layout } from '../components';

// Header layout
<Layout variant="header" spacing="large">
  <Typography variant="title">Page Title</Typography>
</Layout>

// Content area
<Layout variant="content">
  {/* Main content */}
</Layout>

// Footer
<Layout variant="footer">
  <Button>Footer Button</Button>
</Layout>

// Row layout
<Layout variant="row">
  <Typography>Left</Typography>
  <Typography>Right</Typography>
</Layout>
```

**Variants:**
- `header`: Header area with top margin and center alignment
- `content`: Main content area with flex-1
- `footer`: Footer area with bottom margin and center alignment
- `row`: Horizontal row with space-between
- `center`: Centered content
- `loading`: Loading state layout

**Spacing:**
- `none`: No margin
- `small`: Small margin (mb-2)
- `medium`: Medium margin (mb-5)
- `large`: Large margin (mb-10)

## Usage Examples

### Before (with individual styled components):
```tsx
const StyledContainer = styled(View, "flex-1 bg-[#1a1a2e] p-5");
const StyledTitle = styled(Text, "text-2xl font-bold text-white mb-2");
const StyledButton = styled(TouchableOpacity, "bg-[#FF6B9D] rounded-3xl py-5 items-center mb-10 shadow-lg");
const StyledButtonText = styled(Text, "text-white text-xl font-bold");

return (
  <StyledContainer>
    <StyledTitle>Welcome!</StyledTitle>
    <StyledButton onPress={handlePress}>
      <StyledButtonText>Click Me</StyledButtonText>
    </StyledButton>
  </StyledContainer>
);
```

### After (with reusable components):
```tsx
import { Container, Typography, Button } from '../components';

return (
  <Container variant="primary">
    <Typography variant="heading" weight="bold" className="mb-2">
      Welcome!
    </Typography>
    <Button variant="primary" size="large" onPress={handlePress} className="mb-10">
      Click Me
    </Button>
  </Container>
);
```

## Benefits

1. **Consistency**: All components follow the same design system
2. **Maintainability**: Changes to styling can be made in one place
3. **Reusability**: Components can be used across different screens
4. **Type Safety**: Full TypeScript support with proper prop types
5. **Flexibility**: Components accept custom className props for additional styling
6. **Smaller Files**: Screen components are much more concise and readable

## Customization

All components accept a `className` prop for additional Tailwind classes:

```tsx
<Button variant="primary" className="mt-4 mx-2">
  Custom Spacing
</Button>

<Typography variant="body" className="text-center italic">
  Custom styled text
</Typography>
```

## Color Palette

The components use the app's consistent color palette:

- **Primary**: #FF6B9D (Pink)
- **Secondary**: #4ECDC4 (Teal)
- **Accent**: #FFE66D (Yellow)
- **Background**: #1a1a2e (Dark blue)
- **Card Background**: #16213e (Darker blue)
- **White**: #FFFFFF
- **Gray**: #6B7280

These colors are defined in the Tailwind config and used consistently across all components.