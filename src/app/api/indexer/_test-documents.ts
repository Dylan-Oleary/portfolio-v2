import type { Document } from "@langchain/core/documents";
import { randomUUID } from "crypto";

export const document1: Document = {
  id: randomUUID(),
  pageContent: `**The Anthem of Metallica**  
    With riffs that roar like a thunderstorm,  
    A rebel’s cry, a spirit reborn.  
    From shadowed depths, their music calls,  
    Echoing through the concert halls.  

    Born in the fire of metal's rise,  
    A symphony fierce, where passion lies.  
    Lars's drums like a pounding heart,  
    James's voice a flame to spark.  

    Kirk's guitar, a wailing plea,  
    Strings that bend like a storm-tossed sea.  
    And Robert’s rhythm, a steady tide,  
    A fortress strong where chaos resides.  

    From “Master of Puppets” to “Fade to Black,”  
    They’ve led the charge, no looking back.  
    A legacy carved in notes and sweat,  
    A name the world will not forget.  

    Through decades long, their power remains,  
    In every chord, in every refrain.  
    Metallica—eternal, raw, and true,  
    A force of nature, breaking through.  
    `,
  metadata: { source: "https://example.com", name: "Metallica" },
};

export const document2: Document = {
  id: randomUUID(),
  pageContent: "Buildings are made out of brick",
  metadata: { source: "https://example.com" },
};
