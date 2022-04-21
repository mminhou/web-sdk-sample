type PageInfo = {
  section: number;
  owner: number;
  book: number;
  page: number;
};

type PageInfo2 = {
  section: number;
  owner: number;
  note: number;
  page: number;
}

type PaperBase = {
  Xmin: number;
  Ymin: number;
}

type Dot = {
  angle: object;
  color: number;
  dotType: number;
  f: number;
  pageInfo: PageInfo;
  penTipType: number;
  timestamp: number;
  x: number;
  y: number;
}

type PdfDot = {
  x: number;
  y: number;
}

type View = {
  width: number;
  height: number;
}

type Options = {
  filters: any;
}

export type { 
  PageInfo,
  PageInfo2,
  PaperBase,
  Dot,
  PdfDot,
  View,
  Options,
};