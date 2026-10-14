import { useId } from "react";

/** Furnished world artwork in the original 960 × 650 coordinate system.
 * The viewport/camera and interactive objects are owned by the game scene.
 */
export default function RoomArtwork() {
  const patternId = useId().replaceAll(":", "");
  return (
    <g
      className="pr-room-artwork"
      shapeRendering="crispEdges"
      aria-hidden="true"
    >
      <defs>
        <pattern
          id={`${patternId}-floor`}
          width="96"
          height="40"
          patternUnits="userSpaceOnUse"
        >
          <rect width="96" height="40" fill="#46546e" />
          <path
            d="M0 0H96V3H0ZM0 20H96V23H0ZM24 0H27V20H24ZM72 20H75V40H72Z"
            fill="#394660"
          />
          <path d="M3 6H46V8H3ZM34 28H66V30H34Z" fill="#52617b" />
        </pattern>
        <pattern
          id={`${patternId}-wall`}
          width="80"
          height="80"
          patternUnits="userSpaceOnUse"
        >
          <rect width="80" height="80" fill="#293a57" />
          <rect x="0" y="0" width="3" height="80" fill="#30425f" />
          <rect x="0" y="0" width="80" height="3" fill="#30425f" />
        </pattern>
      </defs>

      <path d="M78 109H854V586H831V609H111V586H78Z" fill="#0e1424" />
      <path d="M66 88H842V556H819V579H89V556H66Z" fill="#18243d" />
      <rect
        x="82"
        y="102"
        width="744"
        height="245"
        fill={`url(#${patternId}-wall)`}
      />
      <rect
        x="82"
        y="347"
        width="744"
        height="211"
        fill={`url(#${patternId}-floor)`}
      />
      {/* Cool moonlight falls across the boards, in small square pools. */}
      <path
        d="M413 356H480V362H491V385H424V379H413ZM501 356H566V362H577V385H512V379H501ZM433 393H500V400H511V420H444V414H433ZM521 393H586V400H597V420H532V414H521Z"
        fill="#a0b6ba"
        opacity=".10"
      />
      <path
        d="M323 477H346V480H323ZM664 492H698V495H664ZM178 521H199V524H178ZM729 529H759V532H729ZM104 462H121V465H104Z"
        fill="#7c8c9a"
        opacity=".4"
      />
      <rect x="82" y="336" width="744" height="13" fill="#182c48" />
      <rect x="82" y="349" width="744" height="6" fill="#627288" />
      <rect x="82" y="556" width="744" height="12" fill="#293850" />
      <rect x="826" y="102" width="16" height="454" fill="#35465e" />
      <rect x="66" y="88" width="776" height="14" fill="#596b84" />
      <rect x="66" y="102" width="16" height="454" fill="#405371" />

      {/* A little night sky, entirely drawn on the pixel grid. */}
      <rect x="397" y="123" width="205" height="194" fill="#152238" />
      <rect x="389" y="115" width="205" height="194" fill="#d9b7a0" />
      <rect x="397" y="123" width="189" height="178" fill="#0e1a33" />
      <rect x="405" y="131" width="173" height="162" fill="#14213b" />
      <rect x="405" y="241" width="173" height="52" fill="#20314d" />
      <path
        d="M405 262H422V247H447V270H462V253H488V266H508V235H530V259H558V246H578V293H405Z"
        fill="#283f5d"
      />
      <path
        d="M405 278H433V266H458V281H480V270H502V285H542V270H578V293H405Z"
        fill="#354d65"
      />
      <path
        d="M531 148H551V153H559V173H551V181H531V173H523V153H531Z"
        fill="#f2e6bd"
      />
      <path
        d="M542 148H551V153H559V173H551V179H542V174H548V156H542Z"
        fill="#bdbfbe"
      />
      <g className="pr-stars">
        <path
          d="M427 146H431V150H427ZM462 170H466V174H462ZM560 214H564V218H560ZM419 214H423V218H419ZM509 204H513V208H509Z"
          fill="#e7dac2"
        />
        <path
          d="M469 136H473V140H477V144H473V148H469V144H465V140H469Z"
          fill="#91c2c1"
        />
        <rect x="549" y="192" width="3" height="3" fill="#91c2c1" />
      </g>
      <g className="pr-meteor" opacity=".55">
        <path
          d="M443 179H447V183H443ZM447 175H451V179H447ZM451 171H455V175H451Z"
          fill="#7898a8"
        />
        <rect x="455" y="167" width="4" height="4" fill="#dae8cf" />
      </g>
      <rect x="489" y="123" width="8" height="178" fill="#b88f83" />
      <rect x="397" y="211" width="189" height="8" fill="#b88f83" />
      <rect x="381" y="301" width="221" height="12" fill="#e6c7a9" />
      <rect x="381" y="313" width="221" height="7" fill="#94777a" />

      {/* Noticeboard. */}
      <rect x="117" y="142" width="91" height="125" fill="#152238" />
      <rect x="110" y="135" width="91" height="125" fill="#cba087" />
      <rect x="116" y="141" width="79" height="113" fill="#866e68" />
      <rect x="127" y="153" width="54" height="39" fill="#f0dfbf" />
      <rect x="146" y="149" width="15" height="7" fill="#c2776b" />
      <path
        d="M134 163H173V167H134ZM134 172H164V175H134ZM134 179H170V182H134Z"
        fill="#9b968b"
      />
      <rect x="126" y="205" width="25" height="34" fill="#9fbab4" />
      <rect x="159" y="201" width="23" height="32" fill="#d89782" />
      <rect x="132" y="212" width="13" height="3" fill="#4e7780" />
      <rect x="166" y="208" width="10" height="3" fill="#8b6665" />
      <rect x="130" y="145" width="4" height="4" fill="#f2c57f" />

      {/* Warm task light. */}
      <path d="M337 267H344V302H365V308H328V302H337Z" fill="#8a9aa2" />
      <path d="M340 267H347V230H370V223H340Z" fill="#abb9b7" />
      <path d="M363 215H389V222H396V237H356V222H363Z" fill="#df9b7d" />
      <rect x="362" y="237" width="28" height="5" fill="#f5dfac" />
      <path
        className="pr-lamp-light"
        d="M363 242H389L415 314H335Z"
        fill="#f5d28e"
        opacity=".075"
      />
      <path
        d="M350 307H400V310H407V313H342V310H350Z"
        fill="#f5d28e"
        opacity=".18"
      />

      {/* Computer desk. */}
      <rect x="161" y="365" width="263" height="76" fill="#2f3b52" />
      <rect x="164" y="326" width="20" height="114" fill="#a88275" />
      <rect x="394" y="326" width="18" height="114" fill="#a88275" />
      <rect x="164" y="434" width="26" height="8" fill="#25334c" />
      <rect x="388" y="434" width="30" height="8" fill="#25334c" />
      <rect x="149" y="313" width="279" height="15" fill="#e0ba95" />
      <rect x="149" y="328" width="279" height="9" fill="#a17e74" />
      <rect x="341" y="343" width="57" height="53" fill="#8f7770" />
      <rect x="347" y="350" width="45" height="14" fill="#af8e7c" />
      <rect x="347" y="370" width="45" height="19" fill="#af8e7c" />
      <rect x="364" y="353" width="12" height="4" fill="#485365" />
      <rect x="364" y="375" width="12" height="4" fill="#485365" />
      <rect x="250" y="276" width="31" height="26" fill="#9aafa9" />
      <rect x="235" y="300" width="61" height="8" fill="#c6cfbc" />
      <path
        d="M207 184H325V191H332V274H325V281H207V274H200V191H207Z"
        fill="#142235"
      />
      <path
        d="M199 179H317V186H324V269H317V276H199V269H192V186H199Z"
        fill="#c7cbbb"
      />
      <rect x="201" y="188" width="114" height="73" fill="#28464c" />
      <rect x="207" y="194" width="102" height="61" fill="#163b42" />
      <path
        d="M215 207H220V212H225V217H220V222H215V217H219V212H215ZM232 221H250V225H232Z"
        fill="#b3d5af"
      />
      <path
        className="pr-screen-code"
        d="M215 233H240V236H215ZM245 233H271V236H245ZM215 241H256V244H215Z"
        fill="#75a8a3"
      />
      <rect
        className="pr-screen-cursor"
        x="278"
        y="239"
        width="6"
        height="8"
        fill="#e1c282"
      />
      <rect x="251" y="265" width="9" height="4" fill="#718e87" />
      <path d="M217 306H304V311H311V317H210V311H217Z" fill="#d6d0b8" />
      <path
        d="M223 310H228V313H223ZM233 310H238V313H233ZM243 310H248V313H243ZM253 310H258V313H253ZM263 310H268V313H263ZM273 310H278V313H273ZM283 310H288V313H283Z"
        fill="#969b90"
      />
      <rect x="164" y="289" width="21" height="24" fill="#d69078" />
      <path d="M185 293H193V307H185V302H188V298H185Z" fill="#d69078" />
      <rect x="167" y="286" width="15" height="5" fill="#5f514f" />
      <path
        className="pr-coffee-steam"
        d="M171 278V269H175V262"
        fill="none"
        stroke="#d7ccba"
        strokeWidth="3"
        opacity=".55"
      />

      {/* Chair. */}
      <rect x="249" y="370" width="12" height="76" fill="#25314c" />
      <path d="M230 363H276V369H283V398H223V369H230Z" fill="#26334c" />
      <rect x="230" y="363" width="46" height="29" fill="#729792" />
      <rect x="224" y="399" width="60" height="12" fill="#597f80" />
      <rect x="231" y="411" width="46" height="8" fill="#365669" />
      <path d="M224 448H247V440H263V448H287V454H224Z" fill="#26334c" />
      <rect x="223" y="454" width="10" height="7" fill="#17263d" />
      <rect x="277" y="454" width="10" height="7" fill="#17263d" />

      {/* A whole shelf of ideas. */}
      <rect x="658" y="224" width="134" height="223" fill="#1b2a43" />
      <rect x="645" y="213" width="135" height="223" fill="#9b7c70" />
      <rect x="655" y="223" width="115" height="203" fill="#514e58" />
      <rect x="655" y="279" width="115" height="10" fill="#c0a18b" />
      <rect x="655" y="350" width="115" height="10" fill="#c0a18b" />
      <rect x="645" y="426" width="135" height="10" fill="#c0a18b" />
      <rect x="650" y="436" width="11" height="13" fill="#836e67" />
      <rect x="763" y="436" width="11" height="13" fill="#836e67" />
      <rect x="663" y="235" width="15" height="44" fill="#cf8f7e" />
      <rect x="680" y="240" width="11" height="39" fill="#cfbd92" />
      <rect x="694" y="231" width="15" height="48" fill="#799e9c" />
      <rect x="711" y="243" width="12" height="36" fill="#8a9db7" />
      <path d="M731 240H743L756 276L744 279Z" fill="#cb917e" />
      <path
        d="M665 244H676V247H665ZM682 249H689V252H682ZM696 241H707V244H696ZM713 252H721V255H713Z"
        fill="#f4dfb5"
      />
      <rect x="663" y="330" width="52" height="9" fill="#ccbea0" />
      <rect x="659" y="340" width="61" height="10" fill="#7a9a9b" />
      <rect x="668" y="319" width="48" height="11" fill="#ce8e7b" />
      <rect x="735" y="303" width="24" height="47" fill="#adad99" />
      <rect x="740" y="310" width="14" height="13" fill="#6a7d80" />
      <rect x="738" y="332" width="18" height="4" fill="#d8d0b4" />
      <rect x="664" y="380" width="37" height="46" fill="#899dab" />
      <rect x="669" y="387" width="27" height="16" fill="#c8cfbd" />
      <rect x="674" y="392" width="17" height="3" fill="#7c8d91" />
      <rect x="711" y="395" width="52" height="31" fill="#c1a58a" />
      <rect x="711" y="389" width="52" height="7" fill="#ddc3a0" />
      <rect x="729" y="402" width="17" height="7" fill="#846e6a" />

      {/* Pixel fern. */}
      <rect x="104" y="426" width="43" height="9" fill="#334259" />
      <path d="M109 391H147V411H141V426H115V411H109Z" fill="#c7856f" />
      <rect x="105" y="385" width="46" height="10" fill="#dfa28a" />
      <rect x="124" y="335" width="6" height="50" fill="#789e88" />
      <path
        d="M119 355H105V348H96V335H109V340H119ZM131 343H143V331H154V320H140V327H131ZM121 374H104V366H94V354H108V360H121ZM131 366H146V357H158V345H145V352H131Z"
        fill="#86b496"
      />
      <path d="M121 344H112V331H117V317H125V330H129V344Z" fill="#acd0a2" />
      <rect x="125" y="378" width="5" height="7" fill="#557e79" />

      {/* A woven rug. The player is drawn in its own layer. */}
      <path
        d="M378 454H616V465H627V533H616V544H378V533H367V465H378Z"
        fill="#36465e"
      />
      <rect x="380" y="461" width="234" height="73" fill="#ba806f" />
      <rect x="389" y="469" width="216" height="57" fill="#d79d80" />
      <rect x="398" y="478" width="198" height="39" fill="#bc8473" />
      <path
        d="M405 482H416V490H425V482H436V491H427V501H418V511H407V502H414V493H405ZM561 482H572V490H581V482H592V491H583V501H574V511H563V502H570V493H561Z"
        fill="#e4b692"
      />
      <path
        d="M373 469H380V476H373ZM373 483H380V490H373ZM373 497H380V504H373ZM373 511H380V518H373ZM614 469H621V476H614ZM614 483H621V490H614ZM614 497H621V504H614ZM614 511H621V518H614Z"
        fill="#d6aa89"
      />
      {/* Door to the internet: a small mailbox. */}
      <rect x="794" y="451" width="43" height="8" fill="#344057" />
      <rect x="809" y="389" width="10" height="63" fill="#bc9b83" />
      <path d="M790 350H831V357H838V392H783V357H790Z" fill="#cb8d79" />
      <rect x="788" y="362" width="45" height="24" fill="#e4b094" />
      <path d="M795 367H826V380H795ZM795 367L810 375L826 367" fill="#f0dbb6" />
      <path
        d="M795 367L810 375L826 367"
        fill="none"
        stroke="#b99784"
        strokeWidth="3"
      />
      <rect x="834" y="336" width="5" height="27" fill="#e4bf9b" />
      <rect x="837" y="336" width="18" height="10" fill="#d68577" />

      {/* Tiny wall details and a power cable. */}
      <rect x="662" y="142" width="86" height="40" fill="#17263e" />
      <rect x="657" y="137" width="86" height="40" fill="#bed0bd" />
      <rect x="663" y="143" width="74" height="28" fill="#385564" />
      <path
        d="M671 157H681V151H690V160H699V151H708V160H717V151H729"
        fill="none"
        stroke="#a9cbb2"
        strokeWidth="3"
      />
      <path
        d="M328 288H334V349H320V360H309"
        fill="none"
        stroke="#15243c"
        strokeWidth="4"
      />
    </g>
  );
}
