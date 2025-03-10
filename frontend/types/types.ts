export type Slide = {
    type: string;
    title: string;
    subtitle?: string;
    bullets?: string[];
    imageURL?: string;
    imagePrompt?: string;
  };
  
  export type PresentationProps = {
    title: string;
    slides: Slide[];
  };