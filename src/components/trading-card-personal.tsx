"use client";

import React from "react";

// 画像URL（7日間有効）- 必要に応じてローカルアセットに置き換えてください
const img4 = "https://www.figma.com/api/mcp/asset/3e4c274f-2125-42bd-8456-87d51d15b6cf";
const imgMusic = "https://www.figma.com/api/mcp/asset/9d820663-eb2e-4973-90f5-411a75f7fc31";
const imgDog = "https://www.figma.com/api/mcp/asset/fbe5c0bc-04a3-4d5e-9815-062a0a5d40bc";
const imgCoffee = "https://www.figma.com/api/mcp/asset/79644dcc-60b2-48e7-a80e-7e6b6309c887";
const img = "https://www.figma.com/api/mcp/asset/421d0c66-6384-4f20-a732-7d2b9ec08609";
const img1 = "https://www.figma.com/api/mcp/asset/080c469d-24d9-4895-9fb3-72e1b24350ed";
const img2 = "https://www.figma.com/api/mcp/asset/84c083f8-39de-428f-94ba-bbb1d6872be8";
const img3 = "https://www.figma.com/api/mcp/asset/1167c540-7813-4cd7-a270-4dadba152e71";
const img5 = "https://www.figma.com/api/mcp/asset/6a6ce679-78f8-4097-b5c1-f8db98985045";
const img6 = "https://www.figma.com/api/mcp/asset/4120e82f-b5e6-40ed-a0e7-cb59375623ea";
const img7 = "https://www.figma.com/api/mcp/asset/d4c80335-8cac-45f5-b5e7-a9580bfb55f5";

interface BioTitlePillProps {
  className?: string;
}

function BioTitlePill({ className }: BioTitlePillProps) {
  return (
    <div className={className} data-name="Bio title pill" data-node-id="65:1435">
      <p
        className="font-['Bungee:Regular',sans-serif] leading-[48px] not-italic relative shrink-0 text-[#564eb3] text-[40px]"
        data-node-id="65:1414"
      >
        Bio
      </p>
    </div>
  );
}

type BioTitleProps = {
  className?: string;
  color?: "Purple";
};

function BioTitle({ className, color = "Purple" }: BioTitleProps) {
  return (
    <div data-node-id="65:1442" className={className}>
      <BioTitlePill className="absolute bg-[#f1dd02] border border-black border-solid content-stretch flex inset-[0_9.66%_15.15%_0] items-start px-[24px] py-[4px] rounded-[100000px]" />
      <BioTitlePill className="absolute bg-[#f1dd02] border border-black border-solid content-stretch flex inset-[7.58%_4.83%] items-start px-[24px] py-[4px] rounded-[100000px]" />
      <BioTitlePill className="absolute bg-[#f1dd02] border border-black border-solid content-stretch flex inset-[15.15%_0_0_9.66%] items-start px-[24px] py-[4px] rounded-[100000px]" />
    </div>
  );
}

interface IconsMusicProps {
  className?: string;
}

function IconsMusic({ className }: IconsMusicProps) {
  return (
    <div className={className} data-name="Icons/Music1" data-node-id="56:3101">
      <div className="absolute inset-[12.5%_8.79%_15.62%_9.38%]" data-name="Music" data-node-id="56:3100">
        <img alt="" className="block max-w-none size-full" src={imgMusic} />
      </div>
    </div>
  );
}

interface IconsDogProps {
  className?: string;
}

function IconsDog({ className }: IconsDogProps) {
  return (
    <div className={className} data-name="Icons/Dog" data-node-id="56:2731">
      <div className="absolute inset-[10.1%_5.41%_12.5%_5.41%]" data-name="Dog" data-node-id="56:2730">
        <img alt="" className="block max-w-none size-full" src={imgDog} />
      </div>
    </div>
  );
}

interface IconsCoffeeProps {
  className?: string;
}

function IconsCoffee({ className }: IconsCoffeeProps) {
  return (
    <div className={className} data-name="Icons/Coffee" data-node-id="56:2943">
      <div className="absolute inset-[6.25%_3.12%_12.5%_9.38%]" data-name="Coffee" data-node-id="56:2942">
        <img alt="" className="block max-w-none size-full" src={imgCoffee} />
      </div>
    </div>
  );
}

interface TradingCardPersonalProps {
  firstName?: string;
  lastName?: string;
  bio?: string;
  funFact?: string;
  superpowers?: Array<{ icon: "volleyball" | "coffee" | "dog" | "music"; label?: string }>;
  personalitySlider?: number; // 0-100, introvert to extrovert
}

export default function TradingCardPersonal({
  firstName = "Rachel",
  lastName = "Coltrane",
  bio = "Hello!\nIf you're looking to hang out, dance and enjoy some good music, you can summon me!",
  funFact = "I dream in black and white",
  superpowers = [
    { icon: "volleyball" },
    { icon: "coffee" },
    { icon: "dog" },
    { icon: "music" },
  ],
  personalitySlider = 30, // 0 = introvert, 100 = extrovert
}: TradingCardPersonalProps) {
  const sliderPosition = `${personalitySlider}%`;

  return (
    <div
      className="bg-[#564eb3] content-stretch flex flex-col gap-[24px] items-end overflow-clip pb-[64px] pl-[56px] pr-[64px] pt-[48px] relative rounded-[64px] size-full"
      data-name="Card - Personal"
      data-node-id="179:15198"
    >
      {/* Flower background */}
      <div className="absolute flex items-center justify-center left-1/2 size-[421.312px] top-[-158.66px] translate-x-[-50%]">
        <div className="flex-none rotate-[345deg]">
          <div className="relative size-[344px]" data-name="Flower-bg" data-node-id="I179:15198;166:6920">
            <div className="absolute flex inset-0 items-center justify-center">
              <div className="flex-none rotate-[345deg] size-[344px]">
                <div className="relative size-full" data-name="Icons background-Flower-filled bg" data-node-id="I179:15198;166:6920;173:4620">
                  <div className="absolute flex inset-0 items-center justify-center">
                    <div className="flex-none rotate-[345deg] size-[344px]">
                      <div className="relative size-full" data-name="Icons/Flower-filled" data-node-id="I179:15198;166:6920;173:4620;166:7683">
                        <div className="absolute inset-[7.81%_11.56%_7.81%_11.55%]" data-name="Flower-filled" data-node-id="I179:15198;166:6920;173:4620;166:7683;56:3479">
                          <div className="absolute inset-0" style={{ "--fill-0": "rgba(116, 106, 225, 1)" } as React.CSSProperties}>
                            <img alt="" className="block max-w-none size-full" src={img} />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Planet background */}
      <div className="absolute bottom-[201px] left-[33px] size-[224px]" data-name="Planet-bg" data-node-id="I179:15198;166:6921">
        <div className="absolute inset-[12.5%_2.87%_12.5%_2.86%]" data-name="Planet-filled" data-node-id="I179:15198;166:6921;173:4709;166:7684;56:3476">
          <div className="absolute inset-0" style={{ "--fill-0": "rgba(116, 106, 225, 1)" } as React.CSSProperties}>
            <img alt="" className="block max-w-none size-full" src={img1} />
          </div>
        </div>
      </div>

      {/* Caring background */}
      <div className="absolute bottom-[-100px] right-0 size-[416px]" data-name="Caring-bg" data-node-id="I179:15198;166:6922">
        <div className="absolute inset-[12.5%_7.81%]" data-name="Caring-filled" data-node-id="I179:15198;166:6922;173:4749;166:7685;56:3484">
          <div className="absolute inset-0" style={{ "--fill-0": "rgba(116, 106, 225, 1)" } as React.CSSProperties}>
            <img alt="" className="block max-w-none size-full" src={img2} />
          </div>
        </div>
      </div>

      {/* Superpowers */}
      <div
        className="content-stretch flex gap-[24px] items-start justify-end relative shrink-0 w-full"
        data-name="Superpowers"
        data-node-id="I179:15198;166:6923"
      >
        {superpowers.map((power, index) => (
          <div
            key={index}
            className="bg-[#d4ff4e] content-stretch flex items-start p-[10px] relative rounded-[10000px] shrink-0"
            data-name={`Superpower ${index + 1}`}
          >
            {power.icon === "volleyball" && (
              <div className="relative shrink-0 size-[32px]" data-name="Icons/Volleyball">
                <div className="absolute inset-[9.38%]" data-name="Volleyball">
                  <div className="absolute inset-0" style={{ "--fill-0": "rgba(0, 0, 0, 1)" } as React.CSSProperties}>
                    <img alt="" className="block max-w-none size-full" src={img3} />
                  </div>
                </div>
              </div>
            )}
            {power.icon === "coffee" && <IconsCoffee className="relative shrink-0 size-[32px]" />}
            {power.icon === "dog" && <IconsDog className="relative shrink-0 size-[32px]" />}
            {power.icon === "music" && <IconsMusic className="relative shrink-0 size-[32px]" />}
          </div>
        ))}
      </div>

      {/* Photo + bottom section */}
      <div
        className="content-stretch flex flex-col gap-[40px] items-center relative shrink-0 w-full"
        data-name="Photo + bottom"
        data-node-id="I179:15198;166:6924"
      >
        <div
          className="content-stretch flex h-[624px] items-start p-[64px] relative shrink-0 w-full"
          data-name="Photo + name"
          data-node-id="I179:15198;166:6925"
        >
          <div
            className="content-stretch flex flex-[1_0_0] items-start min-h-px min-w-px relative shrink-0"
            data-name="Photo + name"
            data-node-id="I179:15198;166:6926"
          >
            <div
              className="absolute bg-[#ff84c5] border border-black border-solid inset-[4.92%_-5.36%_-4.92%_5.36%]"
              data-name="Frame shadow"
              data-node-id="I179:15198;166:6926;166:6863"
            />
            <div
              className="bg-[#ffa5d4] border border-black border-solid content-stretch flex flex-[1_0_0] h-[488px] items-start min-h-px min-w-px pb-[64px] pt-[24px] px-[24px] relative shrink-0"
              data-name="Photo + frame"
              data-node-id="I179:15198;166:6926;166:6864"
            >
              <div className="flex-[1_0_0] h-full min-h-px min-w-px relative shrink-0" data-name="Photo" data-node-id="I179:15198;166:6926;166:6864;77:1220">
                <div className="absolute border border-black border-solid inset-0" data-name="Photo" data-node-id="I179:15198;166:6926;166:6864;77:1220;166:6854">
                  <div aria-hidden="true" className="absolute inset-0 pointer-events-none">
                    <div className="absolute bg-[#f1dd02] inset-0" />
                    <img alt="" className="absolute max-w-none object-50%-50% object-cover size-full" src={img4} />
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute right-[-64px] size-[64px] top-[28px]" data-name="Icons/Sparkle-filled" data-node-id="I179:15198;166:6926;166:6865">
              <div className="absolute inset-[6.04%_6.02%_6.04%_6.04%]" data-name="Sparkle-filled" data-node-id="I179:15198;166:6926;166:6865;56:2521">
                <div className="absolute inset-0" style={{ "--fill-0": "rgba(255, 255, 255, 1)", "--stroke-0": "rgba(0, 0, 0, 1)" } as React.CSSProperties}>
                  <img alt="" className="block max-w-none size-full" src={img5} />
                </div>
              </div>
            </div>
            <div className="absolute right-[-67px] size-[32px] top-0" data-name="Icons/Sparkle" data-node-id="I179:15198;166:6926;166:6866">
              <div className="absolute inset-[9.17%]" data-name="Sparkle" data-node-id="I179:15198;166:6926;166:6866;56:2269">
                <div className="absolute inset-[-3.83%]" style={{ "--stroke-0": "rgba(255, 255, 255, 1)" } as React.CSSProperties}>
                  <img alt="" className="block max-w-none size-full" src={img6} />
                </div>
              </div>
            </div>
            <div className="absolute content-stretch flex items-start left-[-49px] top-[488.5px]" data-name="Last name" data-node-id="I179:15198;166:6926;235:23454">
              <p
                className="font-['Monoton:Regular',sans-serif] h-[72px] leading-[72px] not-italic relative shrink-0 text-[64px] text-right text-white uppercase w-[568px] whitespace-pre-wrap"
                data-node-id="I179:15198;166:6926;235:23454;235:22117"
              >
                {lastName}
              </p>
            </div>
            <div className="absolute content-stretch flex items-start left-[-53.5px] top-[-48.5px]" data-name="Name" data-node-id="I179:15198;166:6926;235:20106">
              <p
                className="font-['Monoton:Regular',sans-serif] leading-[72px] not-italic relative shrink-0 text-[64px] text-white uppercase"
                data-node-id="I179:15198;166:6926;235:20106;235:19715"
              >
                {firstName}
              </p>
            </div>
            <div className="absolute bottom-[13.23px] flex items-center justify-center left-[-53px] size-[107.778px]">
              <div className="flex-none rotate-[345deg]">
                <div className="relative size-[88px]" data-name="Icons/Star-filled" data-node-id="I179:15198;166:6926;166:6869">
                  <div className="absolute inset-[6.25%_6.24%_9.38%_6.24%]" data-name="Star-filled" data-node-id="I179:15198;166:6926;166:6869;56:2518">
                    <div className="absolute inset-0" style={{ "--fill-0": "rgba(255, 255, 255, 1)", "--stroke-0": "rgba(0, 0, 0, 1)" } as React.CSSProperties}>
                      <img alt="" className="block max-w-none size-full" src={img7} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Card bottom */}
        <div
          className="content-stretch flex gap-[64px] h-[225px] items-start relative shrink-0 w-full"
          data-name="Card bottom"
          data-node-id="I179:15198;166:6927"
        >
          {/* Bio section */}
          <div className="flex-[1_0_0] h-full min-h-px min-w-px relative shrink-0" data-name="Bio" data-node-id="I179:15198;166:6928">
            <div
              className="absolute bg-white border border-black border-solid content-stretch flex flex-col items-center left-[16px] pb-[24px] pt-[64px] px-[16px] right-0 top-[16px]"
              data-name="Bio description"
              data-node-id="I179:15198;166:6928;166:7305"
            >
              <div className="content-stretch flex items-start relative shrink-0 w-full" data-name="Bio description" data-node-id="I179:15198;166:6928;166:7305;235:19141">
                <div
                  className="flex-[1_0_0] font-['Open_Sans:SemiBold',sans-serif] font-semibold leading-[24px] min-h-px min-w-px relative shrink-0 text-[16px] text-black whitespace-pre-wrap"
                  data-node-id="I179:15198;166:6928;166:7305;235:19141;235:9291"
                  style={{ fontVariationSettings: "'wdth' 100" }}
                >
                  {bio.split("\n").map((line, i) => (
                    <p key={i} className="mb-0">
                      {line}
                    </p>
                  ))}
                </div>
              </div>
            </div>
            <BioTitle className="absolute h-[66px] left-0 top-0 w-[145px]" />
          </div>

          {/* Slider + fun fact */}
          <div
            className="content-stretch flex flex-[1_0_0] flex-col gap-[8px] h-full items-start min-h-px min-w-px relative shrink-0"
            data-name="Slider + fun fact"
            data-node-id="I179:15198;166:6929"
          >
            {/* Personality slider */}
            <div
              className="content-stretch flex flex-col h-[136px] items-start pb-[32px] pt-0 px-0 relative shrink-0 w-full"
              data-name="Slider-personality"
              data-node-id="I179:15198;166:6930"
            >
              <div
                className="content-stretch flex items-start justify-between pb-[8px] pt-0 px-0 relative shrink-0 w-full"
                data-name="Monkeys"
                data-node-id="I179:15198;166:6930;166:7313"
              >
                <div className="overflow-clip relative shrink-0 size-[48px]" data-name="Emojis/Introvert" data-node-id="I179:15198;166:6930;166:7314">
                  <div
                    className="absolute flex flex-col font-['Inter:Bold',sans-serif] font-bold inset-[-6.25%_0_-3.13%_0] justify-center leading-[0] not-italic text-[48px] text-black text-center whitespace-nowrap"
                    data-node-id="I179:15198;166:6930;166:7314;14:12168"
                  >
                    <p className="leading-[1.1]">🙈</p>
                  </div>
                </div>
                <div className="overflow-clip relative shrink-0 size-[48px]" data-name="Emojis/Extrovert" data-node-id="I179:15198;166:6930;166:7315">
                  <div
                    className="absolute flex flex-col font-['Inter:Bold',sans-serif] font-bold inset-[-6.25%_0_-3.13%_0] justify-center leading-[0] not-italic text-[48px] text-black text-center whitespace-nowrap"
                    data-node-id="I179:15198;166:6930;166:7315;14:12186"
                  >
                    <p className="leading-[1.1]">🐵</p>
                  </div>
                </div>
              </div>
              <div className="h-[46px] relative shrink-0 w-full" data-name="Slider" data-node-id="I179:15198;166:6930;166:7316">
                <div className="absolute flex h-[32px] items-center justify-center left-0 right-0 top-[12px]">
                  <div className="flex-none h-[32px] rotate-[180deg] scale-y-[-100%] w-[248px]">
                    <div
                      className="bg-[#d4ff4e] border border-black border-solid rounded-[40px] size-full"
                      data-name="Slider tracker"
                      data-node-id="I179:15198;166:6930;166:7317"
                    />
                  </div>
                </div>
                <div
                  className="absolute flex items-center justify-center top-[-4px]"
                  style={{ left: `calc(${sliderPosition} - 27px)`, right: `calc(100% - ${sliderPosition} - 27px)` }}
                >
                  <div className="flex-none h-[48px] rotate-[180deg] scale-y-[-100%] w-[54px]">
                    <div
                      className="content-stretch flex items-start justify-center pl-0 pr-[264px] py-0 relative w-full"
                      data-name="Slider thumb + tracker"
                      data-node-id="I179:15198;166:6930;166:7318"
                    >
                      <div className="flex items-center justify-center relative shrink-0">
                        <div className="flex-none rotate-[180deg] scale-y-[-100%]">
                          <div className="overflow-clip relative size-[48px]" data-name="Emojis/Cherry-blossom-flower" data-node-id="I179:15198;166:6930;166:7319">
                            <div
                              className="absolute flex flex-col font-['Inter:Bold',sans-serif] font-bold inset-[-3.13%_0_-6.25%_0] justify-center leading-[0] not-italic text-[48px] text-black text-center whitespace-nowrap"
                              data-node-id="I179:15198;166:6930;166:7319;14:12334"
                            >
                              <p className="leading-[1.1]">🌸</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Fun fact */}
            <div
              className="bg-white border border-black border-solid content-stretch flex flex-col items-start p-[16px] relative shrink-0 w-full"
              data-name="Fun fact"
              data-node-id="I179:15198;235:15480"
            >
              <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Fun fact" data-node-id="I179:15198;235:15480;235:15367">
                <p
                  className="font-['Righteous:Regular',sans-serif] leading-[24px] not-italic relative shrink-0 text-[#564eb3] text-[16px] w-full whitespace-pre-wrap"
                  data-node-id="I179:15198;235:15480;166:7412"
                >
                  Fun fact!
                </p>
                <div className="content-stretch flex items-start relative shrink-0 w-full" data-name="Fun fact text" data-node-id="I179:15198;235:15480;235:13699">
                  <p
                    className="flex-[1_0_0] font-['Open_Sans:SemiBold',sans-serif] font-semibold leading-[24px] min-h-px min-w-px relative shrink-0 text-[16px] text-black whitespace-pre-wrap"
                    data-node-id="I179:15198;235:15480;235:13699;235:10452"
                    style={{ fontVariationSettings: "'wdth' 100" }}
                  >
                    {funFact}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


