class LandRequestModel {
    public landTokenId: string = String()
    public landName: string = String()
    public landDescription: string = String()
    public landOwnerTokenId: string = String()
    public landLocation: string = String()
    public landStatus: number = Number()
    public landAssets: string = String()
    public onRecommend: boolean = Boolean()
}

export default LandRequestModel