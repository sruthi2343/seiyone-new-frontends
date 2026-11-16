import loginBackground from "@/assets/images/login-background.webp";
import loginBackgroundMobile from "@/assets/images/login-background-mobile.webp";
import loginLaptopSmall from "@/assets/images/login-laptop-small.webp";
import loginLaptopStandard from "@/assets/images/login-laptop-standard.webp";

/**
 * Full-screen photo behind the login card. Same sources and media queries as old Seiyone:
 * 4:3-ish laptops, wide laptops, phones, and the default for tablets and large desktops.
 */
export function LoginBackground() {
  return (
    <picture aria-hidden="true" className="fixed inset-0 -z-1 block h-full w-full">
      <source
        media="(min-width: 1024px) and (max-width: 1439px) and (max-aspect-ratio: 3 / 2)"
        srcSet={loginLaptopSmall}
      />
      <source media="(min-width: 1024px) and (max-width: 1439px)" srcSet={loginLaptopStandard} />
      <source media="(max-width: 767px)" srcSet={loginBackgroundMobile} />
      <img
        src={loginBackground}
        alt=""
        fetchPriority="high"
        decoding="async"
        className="block h-full w-full object-cover object-left lg:max-[1440px]:object-right"
      />
    </picture>
  );
}
