export interface SBAssetFile {
  alt?: string;
  copyright?: string;
  id: string;
  filename: string;
  name: string;
  title?: string;
  base64?: string;
  focus?: string;
  [k: string]: any;
}

export const enum LinktypeEnum {
  Url = "url",
  Story = "story",
  Asset = "asset",
  Email = "email"
}

export interface SBLink {
  url: string;
  cached_url: string;
  email?: string;
  id: string;
  fieldtype: string;
  anchor?: string;
  linktype?: LinktypeEnum;
  [k: string]: any;
}

export interface SBLinkHref {
  anchor?: string;
  href: string;
  linktype?: LinktypeEnum;
  [k: string]: any;
}

export interface SBSeo {
  description: string;
  og_description: string;
  og_image: string;
  og_title: string;
  plugin: string;
  title: string;
  twitter_description: string;
  twitter_image: string;
  twitter_title: string;
  _uid: string;
  [k: string]: any;
}

export interface SBRichtext {
  content?: Array<Object>;
  [k: string]: any;
}

export interface SBAbopricebox {
  title?: string;
  description?: string;
  price?: string;
  paymentIntervall?: string;
  list?: string;
  button?: SBButton[];
  _uid?: string;
  component?: "aboPriceBox";
  [k: string]: any;
}

export interface SBAbopricetable {
  title?: string;
  aboBox?: SBAbopricebox[];
  _uid?: string;
  component?: "aboPriceTable";
  [k: string]: any;
}

export interface SBAddressinformation {
  companyName?: string;
  address?: string;
  location?: string;
  phone?: string;
  email?: string;
  isRow?: boolean;
  _uid?: string;
  component?: "addressInformation";
  [k: string]: any;
}

export interface SBButton {
  label: string;
  link?: SBLink;
  _uid?: string;
  component?: "button";
  [k: string]: any;
}

export interface SBCategoryoverview {
  title?: string;
  description?: string;
  _uid?: string;
  component?: "categoryOverview";
  [k: string]: any;
}

export interface SBCategorypage {
  body?: (
    | SBAbopricetable
    | SBAddressinformation
    | SBCategoryoverview
    | SBContactbox
    | SBContactform
    | SBHeaderimage
    | SBImagegallery
    | SBImagetext
    | SBInfocard
    | SBInfocardrow
    | SBNewsletter
    | SBProductdetail
    | SBRecipeimageheader
    | SBTextblock
  )[];
  _uid?: string;
  component?: "categoryPage";
  [k: string]: any;
}

export interface SBContact {
  image?: SBAssetFile;
  title?: string;
  name?: string;
  jobTitle?: string;
  _uid?: string;
  component?: "contact";
  [k: string]: any;
}

export interface SBContactbox {
  title?: string;
  addressItem?: SBAddressinformation[];
  contact?: SBContact[];
  openingDays?: string;
  openingHours?: string;
  button?: SBButton[];
  _uid?: string;
  component?: "contactBox";
  [k: string]: any;
}

export interface SBContactform {
  _uid?: string;
  component?: "contactForm";
  [k: string]: any;
}

export interface SBFooter {
  addressInformation?: SBAddressinformation[];
  linkSection?: SBFootersection[];
  footerBottomSection?: SBFooterbottomsection[];
  _uid?: string;
  component?: "footer";
  [k: string]: any;
}

export interface SBFooterbottomsection {
  links?: SBLinkitem[];
  facebookUrl?: SBLink;
  instagrammUrl?: SBLink;
  youtubeUrl?: SBLink;
  _uid?: string;
  component?: "footerBottomSection";
  [k: string]: any;
}

export interface SBFootersection {
  title?: string;
  links?: SBLinkitem[];
  _uid?: string;
  component?: "footerSection";
  [k: string]: any;
}

export interface SBGalleryitem {
  title?: string;
  subtitle?: string;
  image?: SBAssetFile;
  _uid?: string;
  component?: "galleryItem";
  [k: string]: any;
}

export interface SBGiftconfiguratorpage {
  title?: SBRichtext;
  _uid?: string;
  component?: "giftConfiguratorPage";
  [k: string]: any;
}

export interface SBGiftpage {
  _uid?: string;
  component?: "giftPage";
  [k: string]: any;
}

export interface SBGlobal {
  navigation?: SBNavigation[];
  footer?: SBFooter[];
  specialOfferBanner?: string;
  _uid?: string;
  component?: "global";
  [k: string]: any;
}

export const enum VariantEnum {
  Left = "left",
  Center = "center"
}

export const enum TextcolorEnum {
  White = "white",
  Black = "black"
}

export interface SBHeaderimage {
  text: string;
  subText?: string;
  button?: SBButton[];
  image: SBAssetFile;
  variant: VariantEnum;
  textColor: TextcolorEnum;
  _uid?: string;
  component?: "headerImage";
  [k: string]: any;
}

export interface SBImagegallery {
  items?: SBGalleryitem[];
  _uid?: string;
  component?: "imageGallery";
  [k: string]: any;
}

export const enum ContentvariationEnum {
  Imageleft = "imageLeft",
  Imageright = "imageRight",
  Fullwidthleft = "fullWidthLeft",
  Fullwidthright = "fullWidthRight",
  Backgroundimage = "backgroundImage"
}

export interface SBImagetext {
  text?: SBTextblock[];
  button?: SBButton[];
  imageGallery?: SBImagegallery[];
  contentVariation?: ContentvariationEnum;
  _uid?: string;
  component?: "imageText";
  [k: string]: any;
}

export const enum PositionEnum {
  Left = "left",
  Center = "center",
  Right = "right"
}

export interface SBInfocard {
  backGroundImage?: SBAssetFile;
  title?: string;
  text?: string;
  button?: SBButton[];
  infoCardBig?: boolean;
  position?: PositionEnum;
  _uid?: string;
  component?: "infoCard";
  [k: string]: any;
}

export interface SBInfocardrow {
  infoCards: SBInfocard[];
  _uid?: string;
  component?: "infoCardRow";
  [k: string]: any;
}

export interface SBLabeltextitem {
  label?: string;
  text?: string;
  _uid?: string;
  component?: "labelTextItem";
  [k: string]: any;
}

export interface SBLinkitem {
  label?: string;
  link?: SBLink;
  _uid?: string;
  component?: "linkItem";
  [k: string]: any;
}

export interface SBManufacturingdetaillist {
  items?: SBLabeltextitem[];
  _uid?: string;
  component?: "manufacturingDetailList";
  [k: string]: any;
}

export interface SBNavigation {
  navigationItem?: SBNavigationitem[];
  _uid?: string;
  component?: "navigation";
  [k: string]: any;
}

export interface SBNavigationitem {
  label: string;
  subNavigationItems?: SBSubnavigationitem[];
  infoCard?: SBInfocard[];
  _uid?: string;
  component?: "navigationItem";
  [k: string]: any;
}

export interface SBNewsletter {
  text?: SBRichtext;
  _uid?: string;
  component?: "newsletter";
  [k: string]: any;
}

export interface SBPage {
  showInitials?: boolean;
  showBanner?: boolean;
  body?: (
    | SBAbopricetable
    | SBAddressinformation
    | SBCategoryoverview
    | SBContactbox
    | SBContactform
    | SBHeaderimage
    | SBImagegallery
    | SBImagetext
    | SBInfocard
    | SBInfocardrow
    | SBNewsletter
    | SBProductdetail
    | SBRecipeimageheader
    | SBTextblock
  )[];
  _uid?: string;
  component?: "page";
  [k: string]: any;
}

export interface SBProductcard {
  backgroundImage?: SBAssetFile;
  title?: string;
  button?: SBButton[];
  _uid?: string;
  component?: "productCard";
  [k: string]: any;
}

export interface SBProductdetail {
  productID?: string;
  isLandingpage?: boolean;
  _uid?: string;
  component?: "productDetail";
  [k: string]: any;
}

export interface SBProductdetailpage {
  productID?: string;
  showRecipe?: boolean;
  showSlider?: boolean;
  showGiftbox?: boolean;
  showAbo?: boolean;
  showInfoCard?: boolean;
  title?: string;
  text?: string;
  imageLeft?: SBAssetFile;
  imageRight?: SBAssetFile;
  details?: SBRichtext;
  _uid?: string;
  component?: "productDetailPage";
  [k: string]: any;
}

export interface SBProductiondetails {
  detailList?: SBLabeltextitem[];
  acidic?: string;
  alkaline?: string;
  additionalInfo?: SBTextitem[];
  _uid?: string;
  component?: "productionDetails";
  [k: string]: any;
}

export interface SBRecipeimageheader {
  image?: SBAssetFile;
  text?: string;
  duration?: string;
  amountPeople?: string;
  _uid?: string;
  component?: "recipeImageHeader";
  [k: string]: any;
}

export interface SBSubnavigationitem {
  title?: string;
  linkItems?: SBLinkitem[];
  _uid?: string;
  component?: "subNavigationItem";
  [k: string]: any;
}

export interface SBTextblock {
  text?: SBRichtext;
  centerText?: boolean;
  _uid?: string;
  component?: "textBlock";
  [k: string]: any;
}

export interface SBTextitem {
  text?: string;
  _uid?: string;
  component?: "textItem";
  [k: string]: any;
}
