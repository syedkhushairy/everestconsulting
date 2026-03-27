export class Package {
  constructor(
    public readonly id: string,
    public readonly weight: number,
    public readonly distance: number,
    public readonly offerCode: string
  ) {}
}
