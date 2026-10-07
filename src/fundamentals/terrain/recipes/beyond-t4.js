// Beyond geological-history T4 reference recipe.
// Composition is intentionally separate from reusable terrain operators and from seed.
// Exact whole-world source is frozen at branch terrain/beyond-t4-baseline,
// commit 55036d8fec8fc2a2ea6b2880aefc9e1c0fbfec62.

export const BEYOND_T4_RECIPE = Object.freeze({
  id:'beyond-geological-history-t4',
  size:104,
  resolution:289,
  strata:[
    {thick:1.25,resist:.30,color:0x74695e},
    {thick:1.05,resist:.86,color:0x99836d},
    {thick:1.45,resist:.42,color:0x806f60},
    {thick:.92,resist:.94,color:0xb09a7d},
    {thick:1.38,resist:.34,color:0x776b5e},
    {thick:1.08,resist:.79,color:0x9c866c},
    {thick:1.62,resist:.50,color:0x857563}
  ],
  history:['stratigraphy','deformation','drainage','differential-erosion','deposition'],
  deformation:{
    continental:{noiseA:[.024,.024,751,1.42],noiseB:[.055,.052,769,.62]},
    northRange:[[-50,22,-18,9,8.2,5.4],[-18,9,12,16,8.7,4.1],[12,16,50,29,9.5,3.5]],
    southRange:[[-45,-31,-12,-18,10,3.0],[-12,-18,25,-26,10.5,2.5]],
    shelf:{axis:[.72,-.34,-21],width:5.8,amplitude:1.35},
    fold:{axis:[.11,.035],noiseScale:.018,noiseSeed:763,noiseWarp:1.2,centerX:-27,width:20,amplitude:1.15},
    tilt:{x:-.095,z:.018,gateX:-5,gateWidth:34}
  },
  drainage:{
    trunk:[[-54,-4,-27,-7],[-27,-7,2,-2],[2,-2,29,-9],[29,-9,54,-4]],
    tributaries:[
      [[-40,31,-25,13],[-25,13,-17,-6]],
      [[18,39,14,18],[14,18,8,-3]],
      [[43,-38,30,-23],[30,-23,24,-8]]
    ],
    trunkCut:{broad:[5.9,5.2,1.55],narrow:[2.5,1.28,1.38]},
    branchCut:{broad:[2.65,3.2,1.55],narrow:[.72,.95,1.45]}
  },
  weather:{base:1.05,amplitude:.78,scale:.035,seed:821},
  stratigraphy:{phaseScale:.92,contactBlend:.22},
  boundedErosion:{cutScale:5.5,neutral:.50,strength:.72},
  bedding:{phaseScale:2.2,noiseScale:.025,noiseSeed:827,noiseWarp:.65,amplitude:.48,gain:1.25,neutral:.48},
  deposition:{kind:'gypsum-sand',center:[27,18],radius:[17,12.5]},
  representation:{bandlimit:'separable-121',mesh:'indexed-alternating-diagonals',flatShading:true},
  presentation:{sandColor:0xd7d2bd,roughness:.96,metalness:.012}
});
