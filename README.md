## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Contracts 

Contract configuration can be found in `constants/addresses.ts`

## Clients 
We can expect to rely on ts-codegen generated interfaces to interact with our contracts.


### Query Client Provider


## Theme

Currently the theme values are located at `constants/theme.ts`, and imported by wrapping our app with a `RootLayout` compenent, providing a `ThemeUIProvider` into the app.  

## Services
