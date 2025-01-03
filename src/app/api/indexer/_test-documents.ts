import type { Document } from "@langchain/core/documents";

export const document1: Document = {
  pageContent: `
    **Work Experience**
    
    - 11 Months as a Software Engineer at RenoRun
    - 1.5 years as a Software Engineer at 44 North Digital Marketing
    - 2 years as a Software Engineer at Zinnia
    `,
  metadata: { name: "Work Experience" },
};

export const document2: Document = {
  pageContent: `
    **Interests**

    - Interest in only one thing – yogurt chips
    `,
  metadata: { name: "Interests" },
};
