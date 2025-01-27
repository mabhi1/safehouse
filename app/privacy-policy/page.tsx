import privacyPolicyPage from "@/lib/privacy-policy.json";

export default function PrivacyPolicy() {
  const { privacyPolicy } = privacyPolicyPage;

  return (
    <div className="space-y-5">
      <div className="text-base uppercase">Privacy Policy</div>
      <div>
        <span className="font-medium">Effective date: </span>
        {privacyPolicy.effectiveDate}
      </div>
      <div>{privacyPolicy.introduction}</div>
      <ul className="space-y-5">
        {privacyPolicy.sections.map((section) => (
          <li key={section.title} className="space-y-2">
            <div className="font-semibold">{section.title}</div>
            <div className="pl-4">{section.content.heading}</div>
            {section.content.bulletPoints.length > 0 ? (
              <ul className="pl-4 space-y-2">
                {section.content.bulletPoints.map((point) => {
                  const pointArr = point.split(":");
                  return (
                    <li key={point}>
                      <span className={pointArr.length > 1 ? "underline underline-offset-2" : ""}>{pointArr[0]}</span>
                      {":"}
                      {pointArr.length > 1 && pointArr[1]}
                      {":"}
                      {pointArr.length > 2 && pointArr[2]}
                    </li>
                  );
                })}
              </ul>
            ) : (
              <></>
            )}
          </li>
        ))}
      </ul>
      <div>{privacyPolicy.conclusion}</div>
    </div>
  );
}
