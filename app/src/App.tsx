import { ContactCards } from "@/components/ContactCards";
import { DottedVeil } from "@/components/DottedVeil";
import { MotionToggle } from "@/components/MotionToggle";
import { SiteNavigation } from "@/components/SiteNavigation";
import { HyperText } from "@/components/ui/hyper-text";
import { useMotionEnabled } from "@/lib/motion-preference";
import { useEffect, useRef } from "react";

const assets = `${import.meta.env.BASE_URL}assets/`;
const BG_VIDEO = `${assets}hero-video.mp4`;

function HeroBackgroundVideo() {
  const video = useRef<HTMLVideoElement>(null);
  const motionEnabled = useMotionEnabled();

  useEffect(() => {
    if (motionEnabled) void video.current?.play().catch(() => {});
    else video.current?.pause();
  }, [motionEnabled]);

  return <video ref={video} className="hero-video" src={BG_VIDEO} autoPlay muted loop playsInline preload="metadata" aria-hidden="true" />;
}

const capabilities = [
  {
    title: "Cloud & infrastructure",
    description: "Version-controlled provisioning across cloud and on-premises environments.",
    tools: "AWS · Azure · Alicloud · Terraform · Terragrunt · Atlantis · Ansible",
  },
  {
    title: "Containers & delivery",
    description: "Shared platforms and consistent application releases using containers and GitOps.",
    tools: "Kubernetes · Docker · Helm · ArgoCD · GitLab CI · Harbor · Vault",
  },
  {
    title: "Observability & automation",
    description: "Signals and scripts that make recurring work and production issues easier to handle.",
    tools: "Prometheus · Grafana · Loki · Fluent Bit · InfluxDB · Python · Go · Bash · ACME",
  },
  {
    title: "Virtualization",
    description: "Virtual machine platforms that support flexible infrastructure.",
    tools: "VMware · Proxmox · Hyper-V",
  },
  {
    title: "Windows & identity",
    description: "Core services, administration, and access across Windows environments.",
    tools: "Windows Server · Active Directory · DNS & DHCP · Firewall administration · Authentication & identity management",
  },
];

function SectionKicker({ text }: { text: string }) {
  return <div className="section-kicker">{text}</div>;
}

function HoverTitle({ text }: { text: string }) {
  return <HyperText className="heading-hyper" text={text} animateOnLoad={false} />;
}

function App() {
  return (
    <>
      <a className="skip" href="#main">Skip to content</a>
      <DottedVeil />
      <header className="site-header">
        <div className="wrap header-inner">
          <a className="brand" href="#home" aria-label="Derrick Tan, home"><img src={`${assets}dt-logo.svg`} alt="" width="49" height="49" /></a>
          <SiteNavigation />
          <div className="header-actions"><MotionToggle /></div>
        </div>
      </header>
      <main id="main">
        <section className="hero liquid-hero" id="home" aria-labelledby="hero-title">
          <HeroBackgroundVideo />
          <div className="hero-video-tint" aria-hidden="true" />
          <div className="hero-video-shade" aria-hidden="true" />
          <div className="hero-copy">
            <div className="eyebrow">Derrick Tan · Kuala Lumpur</div>
            <h1 id="hero-title">Cloud systems.<span>Made practical.</span></h1>
            <p className="hero-lede">I build repeatable infrastructure and make the path from a working idea to a reliable deployment clearer.</p>
            <p className="hero-sub">Kubernetes, infrastructure as code, GitOps, and observability across cloud and on-premises environments.</p>
            <ContactCards />
          </div>
        </section>

        <section className="section wrap" id="about" aria-labelledby="about-title">
          <div className="section-head">
            <div><SectionKicker text="About" /><h2 className="section-heading" id="about-title"><HoverTitle text="The work behind" /><br /><HoverTitle text="the infrastructure." /></h2></div>
            <p className="section-intro">I work where cloud provisioning, container platforms, and day-to-day operations meet.</p>
          </div>
          <div className="about-layout">
            <div className="about-copy">
              <p>Reliable systems start with changes that are easy to repeat and easy to understand.</p>
              <p>My work spans Kubernetes platform services, GitOps delivery, Terraform-based provisioning, and observability across AWS, Azure, Alicloud, and on-premises environments.</p>
              <p>I have built deployment workflows, infrastructure definitions, monitoring stacks, certificate automation, and operational tools that reduce manual work and make production easier to support.</p>
              <div className="about-facts">
                <div className="fact"><strong>80%</strong><span className="stat-label">Reduction in deployment time through automation</span></div>
                <div className="fact"><strong className="role-title"><span>DevOps Engineer</span><span>System Engineer</span><span>Platform Engineer</span></strong></div>
              </div>
            </div>
            <div className="about-art">
              <img src={`${assets}derrick-profile.png`} alt="Derrick Tan seated in a black T-shirt and sunglasses" width="1446" height="1087" loading="lazy" />
              <div className="portrait-overlay" aria-hidden="true" />
              <div className="portrait-caption" aria-hidden="true"><span>DT / 01</span><span>Build · Deploy · Observe</span></div>
            </div>
          </div>
        </section>

        <section className="section wrap" id="capabilities" aria-labelledby="capabilities-title">
          <div className="section-head">
            <div><SectionKicker text="Capabilities" /><h2 className="section-heading" id="capabilities-title"><HoverTitle text="From foundation" /><br /><HoverTitle text="to feedback." /></h2></div>
            <p className="section-intro">The tools matter when they make delivery repeatable, systems observable, and operations easier to support.</p>
          </div>
          <div className="capabilities">
            {capabilities.map((item) => (
              <article className="capability" key={item.title}>
                <h3><HoverTitle text={item.title} /></h3>
                <div className="cap-detail"><p>{item.description}</p><div className="skill-tools">{item.tools}</div></div>
              </article>
            ))}
          </div>
        </section>

        <section className="section wrap" id="focus" aria-labelledby="focus-title">
          <div className="section-head">
            <div><SectionKicker text="Current focus" /><h2 className="section-heading" id="focus-title"><HoverTitle text="Making the next" /><br /><HoverTitle text="request easier." /></h2></div>
            <p className="section-intro">I am extending the same automation mindset into developer self-service and reusable cloud architecture.</p>
          </div>
          <div className="focus-feature">
            <div><div className="focus-label">In progress / 01</div><h3><HoverTitle text="Cloud service" /><br /><HoverTitle text="marketplace." /></h3></div>
            <p>Developing marketplace items and workflows that give developers a clearer path to commonly requested AWS services.</p>
          </div>
          <div className="focus-more">
            <article className="focus-item"><div className="focus-label">In progress / 02</div><h3><HoverTitle text="Reusable workload paths" /></h3><p>Building standard patterns for APIs, services, databases, secrets, compute, and containers with practical guardrails.</p></article>
            <article className="focus-item"><div className="focus-label">Architecture direction / 03</div><h3><HoverTitle text="Cloud foundations at scale" /></h3><p>Working toward landing-zone patterns, policy as code, multi-account provisioning, and consistent Kubernetes standards.</p></article>
          </div>
        </section>
      </main>
      <footer className="footer wrap"><span>© Derrick Tan</span><span><a href="https://github.com/ruokei" target="_blank" rel="noopener noreferrer">GitHub</a> · <a href="https://www.linkedin.com/in/derrick8tan/" target="_blank" rel="noopener noreferrer">LinkedIn</a> · <a href="mailto:modquack@gmail.com">Email</a></span></footer>
    </>
  );
}

export default App;
