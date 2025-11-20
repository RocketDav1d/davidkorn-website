# Using Downloaded Fonts

## Steps to use a downloaded font:

1. **Place your font files here** (`app/fonts/`)
   - Common formats: `.woff2`, `.woff`, `.ttf`, `.otf`
   - Prefer `.woff2` for best performance

2. **Configure the font in `app/layout.tsx`**:
   ```typescript
   import localFont from "next/font/local";
   
   const myFont = localFont({
     src: [
       {
         path: "./fonts/YourFont-Regular.woff2",
         weight: "400",
         style: "normal",
       },
       {
         path: "./fonts/YourFont-Bold.woff2",
         weight: "700",
         style: "normal",
       },
     ],
     variable: "--font-my-font",
     display: "swap", // Optional: improves loading performance
   });
   ```

3. **Add the font variable to your body className**:
   ```typescript
   <body className={`${myFont.variable} ...`}>
   ```

4. **Use it in your CSS**:
   ```css
   .my-text {
     font-family: var(--font-my-font);
   }
   ```

## Single font file example:
If you only have one font file:
```typescript
const myFont = localFont({
  src: "./fonts/MyFont.woff2",
  variable: "--font-my-font",
});
```

## Multiple font files (different weights/styles):
```typescript
const myFont = localFont({
  src: [
    { path: "./fonts/MyFont-Light.woff2", weight: "300" },
    { path: "./fonts/MyFont-Regular.woff2", weight: "400" },
    { path: "./fonts/MyFont-Medium.woff2", weight: "500" },
    { path: "./fonts/MyFont-Bold.woff2", weight: "700" },
  ],
  variable: "--font-my-font",
});
```

