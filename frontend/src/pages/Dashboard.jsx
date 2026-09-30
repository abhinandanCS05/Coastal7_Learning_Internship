import { ArrowRight, ChevronRight, Headphones, ShieldCheck, Sparkles, Truck, Zap } from "lucide-react";
import { Link } from "react-router-dom";

const categories = [
  {
    name: "Electronics",
    subtitle: "Phones, laptops & smart tech",
    image:
      "https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&w=1200&q=85",
    accent: "from-violet-600/80 via-indigo-600/50 to-transparent",
  },
  {
    name: "Clothing",
    subtitle: "Modern styles for everyone",
    image:
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=85",
    accent: "from-pink-600/80 via-rose-500/40 to-transparent",
  },
  {
    name: "Home & Kitchen",
    subtitle: "Upgrade your everyday space",
    image:
      "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1200&q=85",
    accent: "from-orange-500/80 via-amber-400/40 to-transparent",
  },
  {
    name: "Beauty & Personal Care",
    subtitle: "Care, confidence & essentials",
    image:
      "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=1200&q=85",
    accent: "from-fuchsia-600/80 via-purple-500/40 to-transparent",
  },
  {
    name: "Sports & Fitness",
    subtitle: "Move better. Live stronger.",
    image:
      "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=1200&q=85",
    accent: "from-cyan-600/80 via-blue-500/40 to-transparent",
  },
  {
    name: "Books & Stationery",
    subtitle: "Ideas worth discovering",
    image:
      "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&w=1200&q=85",
    accent: "from-emerald-600/80 via-teal-500/40 to-transparent",
  },
];

const heroImages = [
  "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=85",
];

export default function Dashboard() {
  return (
    <main className="space-y-10 pb-16">
      {/* HERO */}
      <section className="relative overflow-hidden rounded-[2rem] bg-[#080b1f] px-6 py-10 text-white shadow-2xl shadow-indigo-500/10 sm:px-10 lg:px-14 lg:py-14">
        <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-violet-600/30 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 left-1/3 h-80 w-80 rounded-full bg-cyan-500/20 blur-3xl" />
        <div className="pointer-events-none absolute -right-20 top-10 h-72 w-72 rounded-full bg-fuchsia-500/20 blur-3xl" />

        <div className="relative grid items-center gap-12 lg:grid-cols-[1.05fr_.95fr]">
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-indigo-200 backdrop-blur">
              <Sparkles size={14} />
              ShopFlow 2026
            </div>

            <h1 className="max-w-2xl text-4xl font-black leading-[0.98] tracking-[-0.04em] sm:text-5xl lg:text-7xl">
              Shopping that feels
              <span className="block bg-gradient-to-r from-violet-300 via-fuchsia-300 to-cyan-300 bg-clip-text text-transparent">
                beautifully simple.
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-base leading-7 text-slate-300 sm:text-lg">
              Discover 120+ products across electronics, fashion, home,
              beauty, fitness and more ? all in one intelligent shopping
              experience.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/app/products"
                className="group inline-flex items-center gap-2 rounded-2xl bg-white px-6 py-3.5 font-extrabold text-slate-950 shadow-xl shadow-white/10 transition hover:-translate-y-0.5 hover:shadow-white/20"
              >
                Shop all products
                <ArrowRight
                  size={18}
                  className="transition-transform group-hover:translate-x-1"
                />
              </Link>

              <Link
                to="/app/products?category=Electronics"
                className="inline-flex items-center gap-2 rounded-2xl border border-white/15 bg-white/10 px-6 py-3.5 font-bold text-white backdrop-blur transition hover:bg-white/15"
              >
                Explore electronics
              </Link>
            </div>

            <div className="mt-8 flex flex-wrap gap-6 text-sm text-slate-300">
              <span className="flex items-center gap-2">
                <ShieldCheck size={17} className="text-emerald-300" />
                Secure checkout
              </span>
              <span className="flex items-center gap-2">
                <Truck size={17} className="text-cyan-300" />
                Fast delivery
              </span>
              <span className="flex items-center gap-2">
                <Zap size={17} className="text-amber-300" />
                Smart offers
              </span>
            </div>
          </div>

          {/* HERO IMAGE COLLAGE */}
          <div className="relative mx-auto h-[360px] w-full max-w-[540px]">
            <div className="absolute right-0 top-4 h-56 w-44 rotate-6 overflow-hidden rounded-3xl border border-white/20 bg-white/10 shadow-2xl backdrop-blur sm:h-64 sm:w-52">
              <img
                src={heroImages[0]}
                alt="Featured product"
                className="h-full w-full object-cover"
              />
            </div>

            <div className="absolute left-5 top-20 z-10 h-64 w-48 -rotate-6 overflow-hidden rounded-3xl border border-white/20 bg-white/10 shadow-2xl backdrop-blur sm:h-72 sm:w-56">
              <img
                src={heroImages[1]}
                alt="Smart technology"
                className="h-full w-full object-cover"
              />
            </div>

            <div className="absolute bottom-0 right-12 z-20 h-48 w-44 rotate-3 overflow-hidden rounded-3xl border border-white/20 bg-white/10 shadow-2xl backdrop-blur sm:h-56 sm:w-52">
              <img
                src={heroImages[2]}
                alt="Featured fashion"
                className="h-full w-full object-cover"
              />
            </div>

            <div className="absolute bottom-8 left-1/2 z-30 -translate-x-1/2 rounded-2xl border border-white/20 bg-white/10 px-5 py-3 text-center shadow-2xl backdrop-blur-xl">
              <div className="text-2xl font-black">120+</div>
              <div className="text-xs font-semibold text-slate-300">
                products to explore
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* OFFER STRIP */}
      <section className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-violet-100 bg-gradient-to-br from-violet-50 to-white p-5 dark:border-violet-900/40 dark:from-violet-950/30 dark:to-slate-900">
          <p className="text-xs font-black uppercase tracking-wider text-violet-600">
            Welcome offer
          </p>
          <p className="mt-1 text-xl font-black">10% OFF</p>
          <p className="mt-1 text-sm text-slate-500">On orders above 999</p>
        </div>

        <div className="rounded-2xl border border-cyan-100 bg-gradient-to-br from-cyan-50 to-white p-5 dark:border-cyan-900/40 dark:from-cyan-950/30 dark:to-slate-900">
          <p className="text-xs font-black uppercase tracking-wider text-cyan-600">
            Premium saving
          </p>
          <p className="mt-1 text-xl font-black">500 OFF</p>
          <p className="mt-1 text-sm text-slate-500">On orders above 7,999</p>
        </div>

        <div className="rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-50 to-white p-5 dark:border-emerald-900/40 dark:from-emerald-950/30 dark:to-slate-900">
          <p className="text-xs font-black uppercase tracking-wider text-emerald-600">
            Delivery offer
          </p>
          <p className="mt-1 text-xl font-black">FREE SHIPPING</p>
          <p className="mt-1 text-sm text-slate-500">On orders above 499</p>
        </div>
      </section>

      {/* CATEGORIES */}
      <section>
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-indigo-600">
              Explore collections
            </p>
            <h2 className="mt-1 text-3xl font-black tracking-tight">
              Shop by category
            </h2>
          </div>

          <Link
            to="/app/products"
            className="hidden items-center gap-1 text-sm font-bold text-indigo-600 sm:flex"
          >
            View all
            <ChevronRight size={17} />
          </Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <Link
              key={category.name}
              to={`/app/products?category=${encodeURIComponent(category.name)}`}
              className="group relative h-64 overflow-hidden rounded-3xl bg-slate-900 shadow-lg shadow-slate-900/10 transition duration-500 hover:-translate-y-1 hover:shadow-2xl"
            >
              <img
                src={category.image}
                alt={category.name}
                className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-110"
              />

              <div
                className={`absolute inset-0 bg-gradient-to-t ${category.accent} via-transparent to-black/10`}
              />

              <div className="absolute inset-x-0 bottom-0 p-6 text-white">
                <div className="flex items-end justify-between gap-4">
                  <div>
                    <h3 className="text-2xl font-black">{category.name}</h3>
                    <p className="mt-1 text-sm text-white/80">
                      {category.subtitle}
                    </p>
                  </div>

                  <span className="rounded-full bg-white/15 p-3 backdrop-blur transition group-hover:bg-white/25">
                    <ArrowRight size={19} />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* BENEFITS */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          {
            icon: Truck,
            title: "Fast delivery",
            text: "Track every order",
          },
          {
            icon: ShieldCheck,
            title: "Secure checkout",
            text: "Protected account flow",
          },
          {
            icon: Zap,
            title: "Smart offers",
            text: "Save on eligible orders",
          },
          {
            icon: Headphones,
            title: "Customer first",
            text: "Simple support experience",
          },
        ].map(({ icon: Icon, title, text }) => (
          <div
            key={title}
            className="group rounded-2xl border border-slate-200 bg-white p-5 transition hover:-translate-y-1 hover:border-indigo-200 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900"
          >
            <div className="mb-4 inline-flex rounded-xl bg-indigo-50 p-3 text-indigo-600 transition group-hover:bg-indigo-600 group-hover:text-white dark:bg-indigo-950/50">
              <Icon size={21} />
            </div>
            <h3 className="font-black">{title}</h3>
            <p className="mt-1 text-sm text-slate-500">{text}</p>
          </div>
        ))}
      </section>
    </main>
  );
}

