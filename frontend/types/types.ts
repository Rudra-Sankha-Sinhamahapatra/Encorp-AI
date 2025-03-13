export type Slide = {
    type:'title' | 'content' | 'conclusion' ;
    title: string;
    subtitle?: string;
    bullets?: string[];
    description:string;
    imageURL?: string;
    imagePrompt?: string;
  };

  
  export type PresentationProps = {
    title: string;
    slides: Slide[];
  };