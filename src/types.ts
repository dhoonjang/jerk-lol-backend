export interface IPeopleRequest {
  reason: string;
  name: string;
  type: 'up' | 'down';
}

export interface IPeople {
  name: string;
  discordId: string;
  lolName: string;
  position: string;
  subPosition: string;
  tier: number;
}
