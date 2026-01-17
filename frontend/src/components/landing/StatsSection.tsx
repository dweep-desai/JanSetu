import { useEffect, useState, useRef } from "react";
import { Building2, Users, FileText, CreditCard } from "lucide-react";

const stats = [
  {
    icon: Building2,
    value: 2062,
    suffix: "",
    label: "Departments / Entities",
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    icon: FileText,
    value: 1536,
    suffix: "",
    label: "Total Services",
    color: "text-accent",
    bgColor: "bg-accent/10",
  },
  {
    icon: Users,
    value: 50,
    suffix: "M+",
    label: "User Registrations",
    color: "text-jansetu-green",
    bgColor: "bg-jansetu-green/10",
  },
  {
    icon: CreditCard,
    value: 100,
    suffix: "Cr+",
    label: "Transactions",
    color: "text-jansetu-purple",
    bgColor: "bg-jansetu-purple/10",
  },
];

const useCountUp = (end: number, duration: number = 2000, startCounting: boolean) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!startCounting) return;

    let startTime: number | null = null;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * end));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration, startCounting]);

  return count;
};

const StatCard = ({
  icon: Icon,
  value,
  suffix,
  label,
  color,
  bgColor,
  startCounting,
}: {
  icon: React.ComponentType<{ className?: string }>;
  value: number;
  suffix: string;
  label: string;
  color: string;
  bgColor: string;
  startCounting: boolean;
}) => {
  const count = useCountUp(value, 2000, startCounting);

  return (
    <div className="flex flex-col items-center text-center p-6 bg-card rounded-2xl shadow-sm border border-border hover:shadow-md transition-shadow">
      <div className={`w-14 h-14 ${bgColor} rounded-xl flex items-center justify-center mb-4`}>
        <Icon className={`w-7 h-7 ${color}`} />
      </div>
      <h3 className="text-3xl md:text-4xl font-bold text-foreground">
        {count.toLocaleString()}
        {suffix}
      </h3>
      <p className="text-sm text-muted-foreground mt-1">{label}</p>
    </div>
  );
};

export const StatsSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="py-12 md:py-16 bg-muted/50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {stats.map((stat, index) => (
            <StatCard key={index} {...stat} startCounting={isVisible} />
          ))}
        </div>
      </div>
    </section>
  );
};
