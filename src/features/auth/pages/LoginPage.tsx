import seiyoneLogo from "@/assets/images/seiyone-logo.png";
import { LoginBackground } from "@/features/auth/components/LoginBackground";
import { LoginForm } from "@/features/auth/components/LoginForm";
import { PoweredByFooter } from "@/features/auth/components/PoweredByFooter";
import "@/features/auth/styles/login.css";

/*
 * Layout rules from old Seiyone src/pages/auth/LoginPage.css, by screen size:
 *   default / ≥1200px  card on the right, padding-right clamp(48px, 12.75vw, 213px), card 340 × 470
 *   < 768px            card centred, bigger controls, card min-height 520, page scrolls
 *   768–1023px         card centred, up to 420px wide
 *   1024–1199px        card on the right, padding-right clamp(96px, 14vw, 220px)
 *                      (old CSS set this for 1024–1439, but its ≥1200 rule overrode it from 1200)
 *   height ≤ 700px     card keeps its height, aligned to the top, page scrolls
 */
const PAGE_CLASSES = [
  "login-theme relative flex min-h-dvh w-full items-center justify-end overflow-x-hidden py-6 pl-6 pr-[clamp(48px,12.75vw,213px)]",
  "max-md:justify-center max-md:overflow-y-auto max-md:px-4",
  "md:max-lg:justify-center md:max-lg:px-6",
  "lg:max-[1200px]:pr-[clamp(96px,14vw,220px)]",
  "[@media(max-height:700px)]:items-start [@media(max-height:700px)]:overflow-y-auto",
].join(" ");

const CARD_CLASSES = [
  "relative z-1 box-border flex h-[470px] w-[min(100%,390px)] max-w-[340px] flex-col justify-evenly",
  "rounded-[30px] border-0 bg-(image:--login-card-bg) px-6 py-[18px] backdrop-blur-[5px] backdrop-saturate-[1.45]",
  "max-md:h-auto max-md:min-h-[520px] max-md:w-[min(100%,340px)] max-md:px-[26px] max-md:py-6",
  "md:max-lg:w-[min(100%,420px)] md:max-lg:max-w-[420px]",
  "lg:max-[1200px]:w-[min(340px,calc(100vw-64px))]",
  "md:[@media(max-height:700px)]:min-h-[470px] [@media(max-height:700px)]:my-6",
].join(" ");

export default function LoginPage() {
  return (
    <main className={PAGE_CLASSES}>
      <LoginBackground />

      <section aria-labelledby="login-heading" className={CARD_CLASSES}>
        <div className="flex h-[82px] flex-[0_0_82px] items-center justify-center overflow-hidden max-md:h-[108px] max-md:basis-[108px]">
          <img
            src={seiyoneLogo}
            alt="Seiyone"
            className="block h-[98px] w-[78px] flex-none object-contain max-md:h-[112px] max-md:w-[90px]"
          />
        </div>

        <h1
          id="login-heading"
          className="m-0 text-[21px] leading-[1.2] font-bold tracking-[-0.04em] text-(color:--login-heading) max-md:text-[26px]"
        >
          Welcome back
        </h1>

        <LoginForm />

        <PoweredByFooter />
      </section>
    </main>
  );
}
