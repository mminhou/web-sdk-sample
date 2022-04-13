# web-sdk-sample
Web sdk sample project using 'NeoSmart Pen'

## Installation 
``` sh
$ git clone https://github.com/mminhou/web-sdk-sample
$ cd web-sdk-sample
$ npm install
$ npm start
```
## Usage

### Library Set
```typescript
import PenHelper from '../utils/PenHelper';
```

### Step1: Connect SmartPen to Web service
```typescript
// Connect pen 
const scanPen = () => {
  PenHelper.scanPen();
};
```

### Step2: Data Parsing from SmartPen
```typescript
// Using PenHelper dotCallback function
useEffect(() => {
  PenHelper.dotCallback = (mac, dot) => {
    strokeProcess(dot);
  }
});
```

### Step3: Draw on Canvas with SmartPen
```typescript
// Draw stroke using dot data

```