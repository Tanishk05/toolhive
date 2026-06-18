import Script from "next/script";
import { analyticsConfig } from "@/lib/analytics/config";

export function AnalyticsScripts() {
  if (process.env.NODE_ENV !== "production") return null;

  return (
    <>
      {analyticsConfig.googleAnalyticsMeasurementId ? (
        <>
          <Script
            id="google-analytics-src"
            src={`https://www.googletagmanager.com/gtag/js?id=${analyticsConfig.googleAnalyticsMeasurementId}`}
            strategy="afterInteractive"
          />
          <Script id="google-analytics-init" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${analyticsConfig.googleAnalyticsMeasurementId}', { send_page_view: false });
            `}
          </Script>
        </>
      ) : null}

      {analyticsConfig.microsoftClarityProjectId ? (
        <Script id="microsoft-clarity-init" strategy="afterInteractive">
          {`
            (function(c,l,a,r,i,t,y){
              c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
              t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
              y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "${analyticsConfig.microsoftClarityProjectId}");
          `}
        </Script>
      ) : null}
    </>
  );
}
