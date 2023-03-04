# tw-daterange

A DateRange picker made with tailwind and date-fns

<hr />

## How to install

1. Make sure you have [tailwind](https://tailwindcss.com) installed and setup

2. using npm

```sh
npm install tw-daterange
```

using yarn

```sh
yarn add tw-daterange
```

<hr />

## How to use

```tsx
import { useState } from "react"
import DateRangePicker from "tw-daterange"

const App = () => {
  const [range, setRange] = useState({
    startDate: new Date(),
    endDate: new Date(),
  })

  return (
    <DateRangePicker
      initialRange={range}
      onUpdate={(dateRange) => {
        setRange(dateRange)
      }}
    />
  )
}

export default App
```

<hr />

### License

MIT &copy; Swapnil Soni
