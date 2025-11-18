// Icon components in teal-blue gradient color (#146D7B)
// All icons are thin-lined and use the same color scheme

interface IconProps {
  width?: number
  height?: number
  color?: string
}

const iconColor = '#146D7B'

export const CheckIcon = ({ width = 24, height = 24, color = iconColor }: IconProps) => (
  <svg width={width} height={height} viewBox="0 0 24 24" fill="none">
    <path d="M20 6L9 17L4 12" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

export const ArrowLeftIcon = ({ width = 24, height = 24, color = iconColor }: IconProps) => (
  <svg width={width} height={height} viewBox="0 0 24 24" fill="none">
    <path d="M15 18L9 12L15 6" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

export const XIcon = ({ width = 24, height = 24, color = iconColor }: IconProps) => (
  <svg width={width} height={height} viewBox="0 0 24 24" fill="none">
    <path d="M18 6L6 18M6 6L18 18" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

export const MailIcon = ({ width = 24, height = 24, color = iconColor }: IconProps) => (
  <svg width={width} height={height} viewBox="0 0 24 24" fill="none">
    <rect x="3" y="5" width="18" height="14" rx="2" stroke={color} strokeWidth="2"/>
    <path d="M3 7L12 13L21 7" stroke={color} strokeWidth="2" strokeLinecap="round"/>
  </svg>
)

export const MenuIcon = ({ width = 24, height = 24, color = iconColor }: IconProps) => (
  <svg width={width} height={height} viewBox="0 0 24 24" fill="none">
    <path d="M3 6H21M3 12H21M3 18H21" stroke={color} strokeWidth="2" strokeLinecap="round"/>
  </svg>
)

export const ArrowRightIcon = ({ width = 24, height = 24, color = iconColor }: IconProps) => (
  <svg width={width} height={height} viewBox="0 0 24 24" fill="none">
    <path d="M9 18L15 12L9 6" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

export const PlusIcon = ({ width = 24, height = 24, color = iconColor }: IconProps) => (
  <svg width={width} height={height} viewBox="0 0 24 24" fill="none">
    <path d="M12 5V19M5 12H19" stroke={color} strokeWidth="2" strokeLinecap="round"/>
  </svg>
)

export const DocumentIcon = ({ width = 24, height = 24, color = iconColor }: IconProps) => (
  <svg width={width} height={height} viewBox="0 0 24 24" fill="none">
    <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M14 2V8H20" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

export const PaperclipIcon = ({ width = 24, height = 24, color = iconColor }: IconProps) => (
  <svg width={width} height={height} viewBox="0 0 24 24" fill="none">
    <path d="M21.44 11.05L12.25 20.24C11.1242 21.3658 9.59723 21.9983 8.005 21.9983C6.41277 21.9983 4.88581 21.3658 3.76 20.24C2.63418 19.1142 2.00171 17.5872 2.00171 15.995C2.00171 14.4028 2.63418 12.8758 3.76 11.75L12.95 2.56C13.7006 1.80944 14.7185 1.3877 15.78 1.3877C16.8415 1.3877 17.8594 1.80944 18.61 2.56C19.3606 3.31056 19.7823 4.32846 19.7823 5.39C19.7823 6.45154 19.3606 7.46944 18.61 8.22L9.41 17.41C9.03493 17.7851 8.53093 17.9961 8.005 17.9961C7.47907 17.9961 6.97507 17.7851 6.6 17.41C6.22493 17.0349 6.01392 16.5309 6.01392 16.005C6.01392 15.4791 6.22493 14.9751 6.6 14.6L15.07 6.13" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

export const DocumentFoldedIcon = ({ width = 24, height = 24, color = iconColor }: IconProps) => (
  <svg width={width} height={height} viewBox="0 0 24 24" fill="none">
    <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M14 2V8H20" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M16 13H8M16 17H8M10 9H8" stroke={color} strokeWidth="2" strokeLinecap="round"/>
  </svg>
)

export const DocumentExportIcon = ({ width = 24, height = 24, color = iconColor }: IconProps) => (
  <svg width={width} height={height} viewBox="0 0 24 24" fill="none">
    <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M14 2V8H20" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M16 13H12M16 13L13 10M16 13L13 16" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

export const SearchIcon = ({ width = 24, height = 24, color = iconColor }: IconProps) => (
  <svg width={width} height={height} viewBox="0 0 24 24" fill="none">
    <circle cx="11" cy="11" r="8" stroke={color} strokeWidth="2"/>
    <path d="M21 21L16.65 16.65" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

export const EllipsisIcon = ({ width = 24, height = 24, color = iconColor }: IconProps) => (
  <svg width={width} height={height} viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="5" r="1" fill={color}/>
    <circle cx="12" cy="12" r="1" fill={color}/>
    <circle cx="12" cy="19" r="1" fill={color}/>
  </svg>
)

export const RefreshIcon = ({ width = 24, height = 24, color = iconColor }: IconProps) => (
  <svg width={width} height={height} viewBox="0 0 24 24" fill="none">
    <path d="M1 4V10H7" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M23 20V14H17" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M20.49 9C19.8424 6.78869 18.459 4.93312 16.5701 3.73798C14.6813 2.54283 12.4046 2.08203 10.1785 2.43396C7.95231 2.78589 5.89761 3.92493 4.45673 5.62568C3.01586 7.32642 2.27481 9.47225 2.35499 11.6419C2.43516 13.8116 3.33171 15.8984 4.88675 17.4883C6.44179 19.0783 8.54503 20.0644 10.7143 20.2802C12.8836 20.496 15.0029 19.9314 16.7263 18.6891C18.4497 17.4469 19.6638 15.6015 20.1429 13.5" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

export const QuestionCircleIcon = ({ width = 24, height = 24, color = iconColor }: IconProps) => (
  <svg width={width} height={height} viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2"/>
    <path d="M9 9C9 7.34315 10.3431 6 12 6C13.6569 6 15 7.34315 15 9C15 10.6569 13.6569 12 12 12V14" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    <circle cx="12" cy="17" r="1" fill={color}/>
  </svg>
)

export const CameraIcon = ({ width = 24, height = 24, color = iconColor }: IconProps) => (
  <svg width={width} height={height} viewBox="0 0 24 24" fill="none">
    <path d="M23 19C23 19.5304 22.7893 20.0391 22.4142 20.4142C22.0391 20.7893 21.5304 21 21 21H3C2.46957 21 1.96086 20.7893 1.58579 20.4142C1.21071 20.0391 1 19.5304 1 19V8C1 7.46957 1.21071 6.96086 1.58579 6.58579C1.96086 6.21071 2.46957 6 3 6H7L9 4H15L17 6H21C21.5304 6 22.0391 6.21071 22.4142 6.58579C22.7893 6.96086 23 7.46957 23 8V19Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="12" cy="13" r="4" stroke={color} strokeWidth="2"/>
  </svg>
)

export const LocationIcon = ({ width = 24, height = 24, color = iconColor }: IconProps) => (
  <svg width={width} height={height} viewBox="0 0 24 24" fill="none">
    <path d="M21 10C21 17 12 23 12 23C12 23 3 17 3 10C3 7.61305 3.94821 5.32387 5.63604 3.63604C7.32387 1.94821 9.61305 1 12 1C14.3869 1 16.6761 1.94821 18.364 3.63604C20.0518 5.32387 21 7.61305 21 10Z" stroke={color} strokeWidth="2"/>
    <circle cx="12" cy="10" r="3" stroke={color} strokeWidth="2"/>
  </svg>
)

export const EditIcon = ({ width = 24, height = 24, color = iconColor }: IconProps) => (
  <svg width={width} height={height} viewBox="0 0 24 24" fill="none">
    <path d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M18.5 2.50001C18.8978 2.10219 19.4374 1.87869 20 1.87869C20.5626 1.87869 21.1022 2.10219 21.5 2.50001C21.8978 2.89784 22.1213 3.4374 22.1213 4.00001C22.1213 4.56262 21.8978 5.10219 21.5 5.50001L12 15L8 16L9 12L18.5 2.50001Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

export const PhoneIcon = ({ width = 24, height = 24, color = iconColor }: IconProps) => (
  <svg width={width} height={height} viewBox="0 0 24 24" fill="none">
    <path d="M22 16.92V19.92C22.0011 20.1985 21.9441 20.4742 21.8325 20.7292C21.7209 20.9842 21.5573 21.2127 21.3522 21.3979C21.1472 21.5831 20.9053 21.7206 20.6424 21.8012C20.3796 21.8818 20.1019 21.9035 19.83 21.865C16.743 21.4951 13.787 20.4013 11.19 18.68C8.77382 17.1312 6.72533 14.9576 5.28 12.4C3.57984 9.82556 2.50393 6.90963 2.14 3.865C2.10149 3.59783 2.12084 3.3259 2.19672 3.06731C2.2726 2.80872 2.40319 2.56953 2.58022 2.36524C2.75725 2.16095 2.97662 2.01595 3.22293 1.93006C3.46924 1.84417 3.7362 1.81969 4 1.859L7 2.529C7.32552 2.57589 7.62839 2.72145 7.86918 2.94627C8.10997 3.1711 8.27722 3.46506 8.35 3.789L9.31 7.869C9.3867 8.18891 9.374 8.5289 9.27346 8.84254C9.17291 9.15617 8.98934 9.42966 8.74 9.63L6.79 11.24C8.00469 13.6699 9.82307 15.7403 12.05 17.21L13.67 15.26C13.8703 15.0107 14.1438 14.8271 14.4575 14.7266C14.7711 14.626 15.1111 14.6133 15.43 14.69L19.52 15.65C19.8439 15.7228 20.1379 15.8901 20.3627 16.1309C20.5876 16.3717 20.7331 16.6745 20.78 17L21.45 19.91C21.4892 20.1658 21.4711 20.4288 21.3972 20.6763C21.3233 20.9238 21.1956 21.1494 21.025 21.3359C20.8544 21.5225 20.6453 21.665 20.4129 21.7529C20.1805 21.8408 19.9313 21.8717 19.685 21.843L22 16.92Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

export const HomeIcon = ({ width = 24, height = 24, color = iconColor }: IconProps) => (
  <svg width={width} height={height} viewBox="0 0 24 24" fill="none">
    <path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M9 22V12H15V22" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

export const PackageIcon = ({ width = 24, height = 24, color = iconColor }: IconProps) => (
  <svg width={width} height={height} viewBox="0 0 24 24" fill="none">
    <path d="M21 16V8C20.9996 7.64928 20.9071 7.30481 20.7315 7.00116C20.556 6.69751 20.3037 6.44536 20 6.27L13 2.27C12.696 2.09446 12.3511 2.00205 12 2.00205C11.6489 2.00205 11.304 2.09446 11 2.27L4 6.27C3.69626 6.44536 3.44398 6.69751 3.26846 7.00116C3.09294 7.30481 3.00036 7.64928 3 8V16C3.00036 16.3507 3.09294 16.6952 3.26846 16.9988C3.44398 17.3025 3.69626 17.5546 4 17.73L11 21.73C11.304 21.9055 11.6489 21.9979 12 21.9979C12.3511 21.9979 12.696 21.9055 13 21.73L20 17.73C20.3037 17.5546 20.556 17.3025 20.7315 16.9988C20.9071 16.6952 20.9996 16.3507 21 16Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M3.27 6.96L12 12L20.73 6.96" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 22.08V12" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

export const TruckIcon = ({ width = 24, height = 24, color = iconColor }: IconProps) => (
  <svg width={width} height={height} viewBox="0 0 24 24" fill="none">
    <path d="M1 3H17V14H1V3Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M17 14H21L23 16V18H17V14Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="5.5" cy="18.5" r="2.5" stroke={color} strokeWidth="2"/>
    <circle cx="18.5" cy="18.5" r="2.5" stroke={color} strokeWidth="2"/>
  </svg>
)

export const BoatIcon = ({ width = 24, height = 24, color = iconColor }: IconProps) => (
  <svg width={width} height={height} viewBox="0 0 24 24" fill="none">
    <path d="M2 18C2 18.5304 2.21071 19.0391 2.58579 19.4142C2.96086 19.7893 3.46957 20 4 20C4.53043 20 5.03914 19.7893 5.41421 19.4142C5.78929 19.0391 6 18.5304 6 18C6 17.4696 5.78929 16.9609 5.41421 16.5858C5.03914 16.2107 4.53043 16 4 16C3.46957 16 2.96086 16.2107 2.58579 16.5858C2.21071 16.9609 2 17.4696 2 18Z" stroke={color} strokeWidth="2"/>
    <path d="M2 18L4 12L9 10L20 8L22 10L22 14L20 16L10 18L2 18Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M9 10L10 4L14 2L16 4" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

export const ShieldCheckIcon = ({ width = 24, height = 24, color = iconColor }: IconProps) => (
  <svg width={width} height={height} viewBox="0 0 24 24" fill="none">
    <path d="M12 2L3 7L3 12C3 17.55 7.34 21.74 12 23C16.66 21.74 21 17.55 21 12L21 7L12 2Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M9 12L11 14L15 10" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

export const PriceTagIcon = ({ width = 24, height = 24, color = iconColor }: IconProps) => (
  <svg width={width} height={height} viewBox="0 0 24 24" fill="none">
    <path d="M20.59 13.41L13.42 6.24C13.2343 6.05428 13.0029 5.96167 12.76 5.96H6C5.46957 5.96 4.96086 6.17071 4.58579 6.54579C4.21071 6.92086 4 7.42957 4 7.96V14.96C4 15.4904 4.21071 16.0001 4.58579 16.3752C4.96086 16.7503 5.46957 16.96 6 16.96H12.76C13.0029 16.9583 13.2343 16.8657 13.42 16.68L20.59 9.51C20.7658 9.33242 20.9224 9.13681 21.0571 8.92645C21.1918 8.71609 21.3036 8.49242 21.3902 8.25919C21.4768 8.02596 21.5376 7.78473 21.5714 7.53951C21.6051 7.29429 21.6116 7.04653 21.5906 6.8C21.5696 6.55347 21.5212 6.30981 21.4464 6.07366C21.3716 5.83751 21.2709 5.61059 21.1464 5.39755C21.0219 5.18451 20.8747 4.98684 20.7078 4.80872C20.5409 4.6306 20.3556 4.47328 20.1554 4.34004C19.9552 4.2068 19.7416 4.09865 19.519 4.01788C19.2964 3.93711 19.0664 3.88438 18.8333 3.86083C18.6002 3.83728 18.3656 3.84308 18.134 3.87811C17.9024 3.91314 17.6755 3.97708 17.459 4.06846C17.2425 4.15984 17.038 4.27796 16.85 4.42L9.68 11.59C9.49428 11.7757 9.40167 12.0071 9.4 12.25V18.25C9.4 18.7804 9.61071 19.2901 9.98579 19.6652C10.3609 20.0403 10.8704 20.25 11.4 20.25H17.4C17.6421 20.2483 17.8735 20.1557 18.06 19.97L20.59 17.44C20.7658 17.2624 20.9224 17.0668 21.0571 16.8564C21.1918 16.6461 21.3036 16.4224 21.3902 16.1892C21.4768 15.956 21.5376 15.7147 21.5714 15.4695C21.6051 15.2243 21.6116 14.9765 21.5906 14.73C21.5696 14.4835 21.5212 14.2398 21.4464 14.0037C21.3716 13.7675 21.2709 13.5406 21.1464 13.3276C21.0219 13.1145 20.8747 12.9169 20.7078 12.7387C20.5409 12.5606 20.3556 12.4033 20.1554 12.2701C19.9552 12.1368 19.7416 12.0287 19.519 11.9479C19.2964 11.8671 19.0664 11.8144 18.8333 11.7908C18.6002 11.7673 18.3656 11.7731 18.134 11.8081C17.9024 11.8432 17.6755 11.9071 17.459 11.9985C17.2425 12.0899 17.038 12.208 16.85 12.35L13.42 13.41" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

export const HeartIcon = ({ width = 24, height = 24, color = iconColor }: IconProps) => (
  <svg width={width} height={height} viewBox="0 0 24 24" fill="none">
    <path d="M20.84 4.61C20.3292 4.099 19.7228 3.69364 19.0554 3.41708C18.388 3.14052 17.6725 2.99817 16.95 2.99817C16.2275 2.99817 15.512 3.14052 14.8446 3.41708C14.1772 3.69364 13.5708 4.099 13.06 4.61L12 5.67L10.94 4.61C9.9083 3.57831 8.50903 2.99871 7.05 2.99871C5.59096 2.99871 4.19169 3.57831 3.16 4.61C2.1283 5.64169 1.54871 7.04097 1.54871 8.5C1.54871 9.95903 2.1283 11.3583 3.16 12.39L4.22 13.45L12 21.23L19.78 13.45L20.84 12.39C21.351 11.8792 21.7564 11.2728 22.0329 10.6054C22.3095 9.93798 22.4518 9.22248 22.4518 8.5C22.4518 7.77752 22.3095 7.06202 22.0329 6.39459C21.7564 5.72716 21.351 5.12075 20.84 4.61Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

export const CartIcon = ({ width = 24, height = 24, color = iconColor }: IconProps) => (
  <svg width={width} height={height} viewBox="0 0 24 24" fill="none">
    <path d="M9 20C9.82843 20 10.5 19.3284 10.5 18.5C10.5 17.6716 9.82843 17 9 17C8.17157 17 7.5 17.6716 7.5 18.5C7.5 19.3284 8.17157 20 9 20Z" stroke={color} strokeWidth="2"/>
    <path d="M20 20C20.8284 20 21.5 19.3284 21.5 18.5C21.5 17.6716 20.8284 17 20 17C19.1716 17 18.5 17.6716 18.5 18.5C18.5 19.3284 19.1716 20 20 20Z" stroke={color} strokeWidth="2"/>
    <path d="M1 2H5.5L7.5 14.5H21.5L24 6.5H6.5" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

export const SendIcon = ({ width = 24, height = 24, color = iconColor }: IconProps) => (
  <svg width={width} height={height} viewBox="0 0 24 24" fill="none">
    <path d="M22 2L11 13" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

export const CreditCardIcon = ({ width = 24, height = 24, color = iconColor }: IconProps) => (
  <svg width={width} height={height} viewBox="0 0 24 24" fill="none">
    <rect x="1" y="4" width="22" height="16" rx="2" stroke={color} strokeWidth="2"/>
    <path d="M1 10H23" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    <path d="M5 16H9" stroke={color} strokeWidth="2" strokeLinecap="round"/>
  </svg>
)

export const DollarIcon = ({ width = 24, height = 24, color = iconColor }: IconProps) => (
  <svg width={width} height={height} viewBox="0 0 24 24" fill="none">
    <line x1="12" y1="1" x2="12" y2="23" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    <path d="M17 5H9.5C8.57174 5 7.6815 5.36875 7.02513 6.02513C6.36875 6.6815 6 7.57174 6 8.5C6 9.42826 6.36875 10.3185 7.02513 10.9749C7.6815 11.6313 8.57174 12 9.5 12H14.5C15.4283 12 16.3185 12.3687 16.9749 13.0251C17.6313 13.6815 18 14.5717 18 15.5C18 16.4283 17.6313 17.3185 16.9749 17.9749C16.3185 18.6313 15.4283 19 14.5 19H6" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

export const BriefcaseIcon = ({ width = 24, height = 24, color = iconColor }: IconProps) => (
  <svg width={width} height={height} viewBox="0 0 24 24" fill="none">
    <rect x="2" y="7" width="20" height="14" rx="2" stroke={color} strokeWidth="2"/>
    <path d="M16 21V5C16 4.46957 15.7893 3.96086 15.4142 3.58579C15.0391 3.21071 14.5304 3 14 3H10C9.46957 3 8.96086 3.21071 8.58579 3.58579C8.21071 3.96086 8 4.46957 8 5V21" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

export const WarningIcon = ({ width = 24, height = 24, color = iconColor }: IconProps) => (
  <svg width={width} height={height} viewBox="0 0 24 24" fill="none">
    <path d="M10.29 3.86L1.82 18C1.64543 18.3024 1.55291 18.6453 1.55201 18.9945C1.55111 19.3437 1.64187 19.6871 1.81492 19.9905C1.98797 20.2939 2.2375 20.5467 2.53773 20.7239C2.83797 20.901 3.17781 20.9962 3.52252 21H20.4775C20.8222 20.9962 21.162 20.901 21.4623 20.7239C21.7625 20.5467 22.012 20.2939 22.1851 19.9905C22.3581 19.6871 22.4489 19.3437 22.448 18.9945C22.4471 18.6453 22.3546 18.3024 22.18 18L13.71 3.86C13.5318 3.56611 13.2807 3.32311 12.9812 3.15448C12.6817 2.98585 12.3438 2.89725 12 2.89725C11.6562 2.89725 11.3183 2.98585 11.0188 3.15448C10.7193 3.32311 10.4682 3.56611 10.29 3.86Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 9V13" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 17H12.01" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

export const BadgeIcon = ({ width = 24, height = 24, color = iconColor }: IconProps) => (
  <svg width={width} height={height} viewBox="0 0 24 24" fill="none">
    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

export const BellIcon = ({ width = 24, height = 24, color = iconColor }: IconProps) => (
  <svg width={width} height={height} viewBox="0 0 24 24" fill="none">
    <path d="M18 8C18 6.4087 17.3679 4.88258 16.2426 3.75736C15.1174 2.63214 13.5913 2 12 2C10.4087 2 8.88258 2.63214 7.75736 3.75736C6.63214 4.88258 6 6.4087 6 8C6 15 3 17 3 17H21C21 17 18 15 18 8Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M13.73 21C13.5542 21.3031 13.3019 21.5547 12.9982 21.7295C12.6946 21.9044 12.3504 21.9965 12 21.9965C11.6496 21.9965 11.3054 21.9044 11.0018 21.7295C10.6982 21.5547 10.4458 21.3031 10.27 21" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

export const UserIcon = ({ width = 24, height = 24, color = iconColor }: IconProps) => (
  <svg width={width} height={height} viewBox="0 0 24 24" fill="none">
    <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="12" cy="7" r="4" stroke={color} strokeWidth="2"/>
  </svg>
)

export const UsersIcon = ({ width = 24, height = 24, color = iconColor }: IconProps) => (
  <svg width={width} height={height} viewBox="0 0 24 24" fill="none">
    <path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="9" cy="7" r="4" stroke={color} strokeWidth="2"/>
    <path d="M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.3516 20 15.13" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M16 3.13C16.8604 3.35031 17.623 3.85071 18.1676 4.55232C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89318 18.7122 8.75608 18.1676 9.45769C17.623 10.1593 16.8604 10.6597 16 10.88" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

// Star icons for ratings
export const StarFilledIcon = ({ width = 24, height = 24, color = '#FFD700' }: IconProps) => (
  <svg width={width} height={height} viewBox="0 0 24 24" fill="none">
    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill={color} stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

export const StarOutlineIcon = ({ width = 24, height = 24, color = '#FFD700' }: IconProps) => (
  <svg width={width} height={height} viewBox="0 0 24 24" fill="none">
    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

// Chevron icons
export const ChevronDownIcon = ({ width = 24, height = 24, color = iconColor }: IconProps) => (
  <svg width={width} height={height} viewBox="0 0 24 24" fill="none">
    <path d="M6 9L12 15L18 9" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

export const ChevronUpIcon = ({ width = 24, height = 24, color = iconColor }: IconProps) => (
  <svg width={width} height={height} viewBox="0 0 24 24" fill="none">
    <path d="M18 15L12 9L6 15" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

// Shield with S pattern (for Utmärkelser)
export const ShieldSIcon = ({ width = 60, height = 65, color = iconColor, fillOpacity = 0 }: IconProps & { fillOpacity?: number }) => (
  <svg width={width} height={height} viewBox="0 0 60 65" fill="none">
    <path d="M30 0L0 15L0 35C0 50 15 60 30 65C45 60 60 50 60 35L60 15L30 0Z" 
      fill={color} 
      stroke={color} 
      strokeWidth="2"
      fillOpacity={fillOpacity}
    />
    {/* S pattern inside shield */}
    <path d="M20 20C20 20 25 18 30 20C35 22 38 25 38 30C38 35 35 38 30 38C25 38 22 35 22 30" stroke={color} strokeWidth="2" strokeLinecap="round" fill="none" opacity={0.7}/>
    <path d="M40 35C40 35 35 37 30 35C25 33 22 30 22 25C22 20 25 17 30 17C35 17 38 20 38 25" stroke={color} strokeWidth="2" strokeLinecap="round" fill="none" opacity={0.7}/>
  </svg>
)

