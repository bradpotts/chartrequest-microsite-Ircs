# Typography Standardization System for IRCS Certification Microsite

## Typography Components

### Text Component
The `<Text>` component is the main building block for consistent typography across the site:

```astro
<Text 
  variant="body|lead|small|caption|stat|accent|label" 
  color="default|primary|muted|white"
  align="left|center|right"
  weight="normal|medium|semibold|bold"
  as="p|span|div"
  class="additional-classes"
>
  Your text content
</Text>
```

#### Text Variants
1. **Body** - `text-base leading-relaxed` - Standard paragraph text
2. **Lead** - `text-base md:text-lg leading-relaxed` - Introduction paragraphs
3. **Small** - `text-sm leading-normal` - Secondary text
4. **Caption** - `text-xs leading-normal` - Small captions
5. **Stat** - `text-3xl font-bold leading-tight` - Statistical values
6. **Accent** - `text-base md:text-lg font-semibold` - Emphasized text
7. **Label** - `text-sm font-medium uppercase tracking-wider` - Category labels

### Heading Component
Use the `<Heading>` component for all headings across the site for consistent typography:

1. **H1 - Main Page Titles (Hero Section)**
   - Component: `<Heading level="1" size="xl" />`
   - Classes: `text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight tracking-tight`
   - Usage: Only for main page title in the Hero section

2. **H2 - Section Titles**
   - Component: `<Heading level="2" size="lg" />`
   - Classes: `text-3xl lg:text-4xl font-bold leading-tight tracking-tight`
   - Usage: Main section headers (About, Benefits, Costs, etc.)

3. **H3 - Subsection Titles**
   - Component: `<Heading level="3" size="md" />`
   - Classes: `text-2xl lg:text-3xl font-semibold leading-snug`
   - Usage: Subsection headers within major sections

4. **H4 - Card & Component Titles**
   - Component: `<Heading level="4" size="sm" />`
   - Classes: `text-xl font-semibold leading-snug`
   - Usage: Card headers, smaller component titles

## Implementation Guidelines

### Text Component Usage

```astro
// Lead paragraph for section introductions
<Text variant="lead" color="muted" align="center" class="max-w-4xl mx-auto">
  Introduction paragraph text
</Text>

// Standard body text
<Text variant="body">
  Regular paragraph content
</Text>

// Accent text for highlighting
<Text variant="accent" color="primary">
  Important highlighted text
</Text>

// Statistical values
<Text variant="stat">
  495
</Text>

// Small labels
<Text variant="label" color="muted">
  CERTIFICATION DURATION
</Text>
```

### Heading Usage

```astro
// Main page title
<Heading level="1" size="xl" class="mb-6">
  Page Title
</Heading>

// Section title
<Heading level="2" size="lg" class="mb-4">
  Section Title
</Heading>

// Subsection title
<Heading level="3" size="md" class="mb-2">
  Subsection Title
</Heading>

// Card title
<Heading level="3" size="sm" class="mb-2">
  Card Title
</Heading>
```

### Common Component Patterns

1. **Section Headers**
   ```astro
   <div class="text-center mb-16">
     <Heading level="2" size="lg">
       Section <span class="text-blue-600">Title</span>
     </Heading>
     <Text variant="lead" color="muted" align="center" class="max-w-4xl mx-auto mt-4">
       Section introduction paragraph
     </Text>
   </div>
   ```

2. **Card Components**
   ```astro
   <Card>
     <Heading level="3" size="sm" class="mb-2">Card Title</Heading>
     <Text variant="body" color="muted">
       Card content
     </Text>
   </Card>
   ```

3. **Info Boxes**
   ```astro
   <InfoBox 
     title="Duration"
     value="2-4 hours"
     color="blue"
     bgColor="blue"
   />
   ```

This standardized typography system creates a consistent visual hierarchy across the site while maintaining semantic HTML structure and improving accessibility.
