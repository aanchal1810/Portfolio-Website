export interface Flower {
  id: string;
  imageUrl: string;
  /** Position on the garden island, as a percentage of the island image's width/height (0-100). */
  x: number;
  y: number;
  createdAt: string;
}

export interface ModerationResult {
  isFlower: boolean;
  isAppropriate: boolean;
  reason: string;
}
