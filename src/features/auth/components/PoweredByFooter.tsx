import ectLogoWordmark from "@/assets/images/ect-logo-wordmark.png";

/** "── Powered by [ECT] ──" line at the bottom of the login card (old Seiyone .login-page__footer). */
export function PoweredByFooter() {
  return (
    <div className="flex items-center gap-2.5 text-[10px] font-medium text-(color:--login-footer) max-md:text-[11px] max-md:[@media(max-height:700px)]:mt-4">
      <span aria-hidden="true" className="h-px flex-1 bg-(color:--login-footer)" />
      <span>Powered by</span>
      <img
        src={ectLogoWordmark}
        alt="ECT"
        width={65}
        height={29}
        className="block h-6 w-auto max-w-14 object-contain max-md:h-[27px] max-md:max-w-[62px]"
      />
      <span aria-hidden="true" className="h-px flex-1 bg-(color:--login-footer)" />
    </div>
  );
}
