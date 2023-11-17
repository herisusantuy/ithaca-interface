// Packages
import Link from 'next/link';

const Logo = () => {
  return (
    <Link href='/' title='Click to go home' style={{ display: 'inline-flex' }}>
      <svg width='100' height='30' viewBox='0 0 100 30' fill='none' xmlns='http://www.w3.org/2000/svg'>
        <path
          d='M21.4487 16.1977L23.2273 14.6431L23.8541 14.107L26.378 11.9091L27.2758 11.1228C27.3943 11.0156 27.496 10.9084 27.5807 10.7833C28.1397 10.0149 28.1566 8.88919 27.5299 8.10295C27.1911 7.67409 26.7337 7.42392 26.2425 7.35244C25.7004 7.2631 25.1245 7.42392 24.6672 7.81704L23.329 8.9964L22.7361 9.51461C22.3634 9.85412 22.1602 10.3187 22.1094 10.8191C22.0924 10.8727 22.0755 11.2122 22.0755 11.3909C22.0585 11.641 21.9908 11.8733 21.9061 12.1056C21.8214 12.3022 21.7028 12.5345 21.5673 12.7489C20.6695 14.1785 18.8909 15.7509 16.4687 14.8932C16.4178 14.8754 15.9774 14.6967 15.808 14.6073C15.6895 13.2135 16.367 11.8912 17.5189 11.23L20.1614 9.6933C21.0422 9.19297 27.2588 3.99305 27.2588 3.99305C28.1227 3.24254 28.2413 1.88449 27.5299 0.97316C27.496 0.919553 27.4452 0.865945 27.3943 0.830207C27.3774 0.812338 27.3605 0.794469 27.3435 0.794469C27.3096 0.758731 27.2758 0.740861 27.2419 0.705123C27.2249 0.687254 27.208 0.669385 27.1911 0.669385C27.1572 0.651516 27.1233 0.615777 27.1064 0.597908C27.0894 0.580039 27.0725 0.580039 27.0556 0.56217C27.0217 0.544301 26.9878 0.526432 26.9539 0.508563C26.937 0.490693 26.92 0.490693 26.9031 0.472824C26.8692 0.454955 26.8353 0.437086 26.8015 0.419217C26.7845 0.419217 26.7676 0.401348 26.7507 0.401348C26.7168 0.383479 26.666 0.365609 26.6321 0.34774C26.6151 0.34774 26.5982 0.329871 26.5813 0.329871C26.5304 0.312002 26.4796 0.294133 26.4288 0.294133H26.4119C26.378 0.294133 26.3441 0.276264 26.3102 0.276264C26.2764 0.276264 26.2425 0.258395 26.2086 0.258395C26.1747 0.258395 26.1239 0.258395 26.09 0.240525C26.0562 0.240525 26.0392 0.240525 26.0053 0.240525C25.9715 0.240525 25.9206 0.240525 25.8868 0.240525C25.8529 0.240525 25.819 0.240525 25.8021 0.240525C25.7682 0.240525 25.7174 0.240525 25.6835 0.258395C25.6496 0.258395 25.6157 0.276264 25.5819 0.276264C25.548 0.276264 25.5141 0.294133 25.4633 0.294133C25.4294 0.312002 25.3955 0.312002 25.3617 0.329871C25.3278 0.34774 25.2939 0.34774 25.26 0.365609C25.2261 0.383479 25.1923 0.401348 25.1414 0.419217C25.1076 0.437086 25.0737 0.454955 25.0567 0.454955C25.0229 0.472824 24.9721 0.508563 24.9382 0.526432C24.9212 0.544301 24.8874 0.56217 24.8704 0.56217C24.8027 0.597908 24.7518 0.651516 24.6841 0.705123L22.7869 2.34908C22.7192 2.40269 22.6683 2.4563 22.6175 2.52778C22.5837 2.56351 22.5667 2.58138 22.5498 2.61712C22.5328 2.63499 22.5159 2.65286 22.499 2.6886C22.482 2.70647 22.482 2.72434 22.4651 2.72434C22.4481 2.74221 22.4481 2.76007 22.4312 2.77794C22.4143 2.79581 22.4143 2.81368 22.3973 2.83155C22.3973 2.84942 22.3804 2.86729 22.3804 2.86729C22.3634 2.90303 22.3296 2.95663 22.3126 2.99237C22.3126 3.01024 22.2957 3.02811 22.2957 3.04598C22.2788 3.08172 22.2618 3.13533 22.2449 3.17106C22.2449 3.18893 22.2279 3.2068 22.2279 3.22467C22.211 3.26041 22.1941 3.31402 22.1941 3.34976C22.1941 3.36763 22.1771 3.38549 22.1771 3.40336C22.1602 3.4391 22.1602 3.49271 22.1432 3.52845C22.1432 3.54632 22.1263 3.56419 22.1263 3.59992C22.1263 3.63566 22.1094 3.68927 22.1094 3.72501C22.1094 3.74288 22.1094 3.76075 22.1094 3.79648C22.1094 3.85009 22.1094 3.88583 22.1094 3.93944C22.1094 3.95731 22.1094 3.97518 22.1094 3.99305C22.1094 4.06452 22.1094 4.136 22.1094 4.18961C22.1432 4.54699 21.3132 6.86998 15.3846 7.69196C14.9442 7.74557 14.4868 7.76343 14.0294 7.76343C13.5721 7.76343 13.1147 7.74557 12.6743 7.69196C6.74566 6.86998 5.91564 4.54699 5.94952 4.18961C5.94952 4.11813 5.94952 4.04665 5.94952 3.99305C5.94952 3.97518 5.94952 3.95731 5.94952 3.93944C5.94952 3.88583 5.94952 3.85009 5.94952 3.79648C5.94952 3.77862 5.94952 3.76075 5.94952 3.72501C5.94952 3.68927 5.93258 3.63566 5.93258 3.59992C5.93258 3.58205 5.91564 3.56419 5.91564 3.52845C5.89871 3.49271 5.89871 3.4391 5.88177 3.40336C5.88177 3.38549 5.86483 3.36763 5.86483 3.34976C5.84789 3.31402 5.84789 3.26041 5.83095 3.22467C5.83095 3.2068 5.81401 3.18893 5.81401 3.17106C5.79707 3.13533 5.78013 3.08172 5.76319 3.04598C5.76319 3.02811 5.74625 3.01024 5.74625 2.99237C5.72932 2.95663 5.69544 2.90303 5.6785 2.86729C5.6785 2.84942 5.66156 2.83155 5.66156 2.83155C5.64462 2.81368 5.64462 2.79581 5.62768 2.77794C5.61074 2.76007 5.61074 2.74221 5.5938 2.72434C5.57686 2.70647 5.57686 2.6886 5.55992 2.6886C5.54299 2.67073 5.52605 2.65286 5.50911 2.61712C5.49217 2.58138 5.45829 2.56351 5.44135 2.52778C5.39053 2.47417 5.32278 2.40269 5.27196 2.34908L3.34091 0.687254C3.27315 0.633647 3.22234 0.580039 3.15458 0.544301C3.13764 0.526432 3.10376 0.508563 3.08683 0.508563C3.05295 0.490693 3.00213 0.454955 2.96825 0.437086C2.93437 0.419217 2.9005 0.401348 2.88356 0.401348C2.84968 0.383479 2.8158 0.365609 2.76498 0.34774C2.73111 0.329871 2.69723 0.329871 2.66335 0.312002C2.62947 0.294133 2.59559 0.294133 2.56172 0.276264C2.52784 0.258395 2.49396 0.258395 2.44314 0.258395C2.40926 0.258395 2.37539 0.240525 2.34151 0.240525C2.30763 0.240525 2.25681 0.222656 2.22293 0.222656C2.18906 0.222656 2.15518 0.222656 2.13824 0.222656C2.10436 0.222656 2.05354 0.222656 2.01967 0.222656C1.98579 0.222656 1.96885 0.222656 1.93497 0.222656C1.90109 0.222656 1.85028 0.222656 1.8164 0.240525H1.79946C1.76558 0.240525 1.74864 0.258395 1.7317 0.258395C1.69782 0.258395 1.68089 0.258395 1.64701 0.276264H1.63007H1.61313C1.52843 0.276264 1.47762 0.294133 1.4268 0.294133C1.40986 0.294133 1.39292 0.312002 1.37598 0.312002C1.34211 0.329871 1.30823 0.34774 1.25741 0.365609C1.24047 0.365609 1.22353 0.383479 1.20659 0.383479C1.17271 0.401348 1.13884 0.419217 1.10496 0.437086C1.07108 0.454955 1.05414 0.472824 1.0372 0.472824C1.00332 0.490693 0.969447 0.526432 0.935569 0.544301C0.91863 0.56217 0.90169 0.56217 0.884751 0.580039C0.850873 0.597908 0.816995 0.633647 0.800056 0.651516C0.766178 0.669385 0.749239 0.687254 0.7323 0.705123C0.698422 0.722992 0.681483 0.758731 0.647605 0.794469C0.630666 0.794469 0.613727 0.812338 0.596788 0.830207C0.56291 0.883815 0.512093 0.919553 0.478215 0.97316C-0.250164 1.88449 -0.131591 3.24254 0.7323 3.99305C0.7323 3.99305 6.96586 9.19297 7.82976 9.6933L10.4722 11.23C11.6241 11.8912 12.3017 13.2314 12.1831 14.6073C11.9968 14.6967 11.5563 14.8754 11.5225 14.8932C9.08324 15.7331 7.32158 14.1785 6.45769 12.7847C6.32218 12.5524 6.20361 12.3379 6.11891 12.1414C6.01728 11.9091 5.96646 11.6768 5.94952 11.4266C5.93258 11.2658 5.93258 11.0871 5.91564 11.0335C5.91564 10.9799 5.91564 10.9084 5.89871 10.8548C5.84789 10.3545 5.64462 9.87199 5.27196 9.55035L4.67909 9.03214L3.34091 7.85278C2.88356 7.45966 2.30763 7.29884 1.76558 7.38818C1.27435 7.45966 0.816995 7.70983 0.478215 8.13869C-0.14853 8.92493 -0.131591 10.0328 0.427397 10.8191C0.512093 10.9263 0.613727 11.0335 0.7323 11.1407L1.63007 11.9269L4.15398 14.1248L4.78073 14.6609L6.55933 16.2155C6.84729 16.4657 7.08444 16.8052 7.21995 17.1805C7.54179 18.1454 7.35546 19.2533 6.62708 20.0395C6.62708 20.0395 6.62708 20.0395 6.61014 20.0574C5.27196 19.1997 5.69544 17.6629 5.69544 17.6629C5.71238 17.4664 5.6785 17.2698 5.5938 17.0911C5.54299 16.966 5.45829 16.8588 5.35666 16.7695L5.22114 16.6444C5.22114 16.6444 5.22114 16.6444 5.20421 16.6265L5.00094 16.4478L4.37419 15.8939L3.69663 15.3042L3.49336 15.1255L3.34091 15.0004C2.52784 14.2857 1.34211 14.3571 0.613727 15.1255C0.56291 15.1613 0.512093 15.2149 0.478215 15.2685C0.308824 15.4829 0.190251 15.7152 0.122495 15.9654C0.0886169 16.0905 0.0547388 16.1977 0.0377998 16.3228C-0.0130173 16.6623 0.00392168 17.0018 0.105556 17.3234C0.190251 17.5557 5.18727 29.7782 13.5721 29.7782C13.8092 29.7782 14.1819 29.7782 14.419 29.7782C22.8039 29.7782 27.8009 17.5557 27.8856 17.3234C28.0041 17.0018 28.0211 16.6623 27.9703 16.3228C27.9533 16.1977 27.9195 16.0726 27.8856 15.9654C27.8009 15.7152 27.6823 15.4829 27.5299 15.2685C27.496 15.2149 27.4452 15.1613 27.3943 15.1255C26.666 14.3571 25.4802 14.2857 24.6672 15.0004L24.5147 15.1255L24.3114 15.3042L23.6339 15.8939L23.0071 16.4478L22.8039 16.6265C22.8039 16.6265 22.8039 16.6265 22.7869 16.6444L22.6683 16.7516C22.5667 16.841 22.482 16.9482 22.4312 17.0733C22.3465 17.2519 22.3126 17.4485 22.3296 17.6451C22.3296 17.6451 22.753 19.1818 21.4149 20.0395C21.4149 20.0395 21.4149 20.0395 21.3979 20.0217C20.4832 19.0389 20.4155 17.5379 21.1438 16.4657L21.4487 16.1977ZM13.9956 18.7887L12.5557 17.2698L13.3519 16.43C13.7076 16.0547 14.2835 16.0547 14.6562 16.43L15.4523 17.2698L13.9956 18.7887Z'
          fill='#5EE192'
        />
        <path
          d='M43.448 21.5H41.288V9.932H43.448V21.5ZM54.118 11.7H50.63V21.5H48.478V11.7H44.99V9.932H54.118V11.7ZM65.3838 9.932V21.5H63.2238V16.444H57.7918V21.5H55.6318V9.932H57.7918V14.908H63.2238V9.932H65.3838ZM74.0719 17.132L72.6639 13.284C72.5945 13.1133 72.5225 12.9107 72.4479 12.676C72.3732 12.4413 72.2985 12.188 72.2239 11.916C72.1545 12.188 72.0825 12.444 72.0079 12.684C71.9332 12.9187 71.8612 13.124 71.7919 13.3L70.3919 17.132H74.0719ZM77.8719 21.5H76.2079C76.0212 21.5 75.8692 21.4547 75.7519 21.364C75.6345 21.268 75.5465 21.1507 75.4879 21.012L74.6239 18.652H69.8319L68.9679 21.012C68.9252 21.1347 68.8425 21.2467 68.7199 21.348C68.5972 21.4493 68.4452 21.5 68.2639 21.5H66.5839L71.1359 9.932H73.3279L77.8719 21.5ZM86.6695 18.772C86.7868 18.772 86.8908 18.8173 86.9815 18.908L87.8295 19.828C87.3602 20.4093 86.7815 20.8547 86.0935 21.164C85.4108 21.4733 84.5895 21.628 83.6295 21.628C82.7708 21.628 81.9975 21.4813 81.3095 21.188C80.6268 20.8947 80.0428 20.4867 79.5575 19.964C79.0722 19.4413 78.6988 18.8173 78.4375 18.092C78.1815 17.3667 78.0535 16.5747 78.0535 15.716C78.0535 14.8467 78.1922 14.052 78.4695 13.332C78.7468 12.6067 79.1362 11.9827 79.6375 11.46C80.1442 10.9373 80.7468 10.532 81.4455 10.244C82.1442 9.95067 82.9175 9.804 83.7655 9.804C84.6082 9.804 85.3548 9.94267 86.0055 10.22C86.6615 10.4973 87.2188 10.86 87.6775 11.308L86.9575 12.308C86.9148 12.372 86.8588 12.428 86.7895 12.476C86.7255 12.524 86.6348 12.548 86.5175 12.548C86.4375 12.548 86.3548 12.5267 86.2695 12.484C86.1842 12.436 86.0908 12.38 85.9895 12.316C85.8882 12.2467 85.7708 12.172 85.6375 12.092C85.5042 12.012 85.3495 11.94 85.1735 11.876C84.9975 11.8067 84.7922 11.7507 84.5575 11.708C84.3282 11.66 84.0615 11.636 83.7575 11.636C83.2402 11.636 82.7655 11.7293 82.3335 11.916C81.9068 12.0973 81.5388 12.364 81.2295 12.716C80.9202 13.0627 80.6802 13.4893 80.5095 13.996C80.3388 14.4973 80.2535 15.0707 80.2535 15.716C80.2535 16.3667 80.3442 16.9453 80.5255 17.452C80.7122 17.9587 80.9628 18.3853 81.2775 18.732C81.5922 19.0787 81.9628 19.3453 82.3895 19.532C82.8162 19.7133 83.2748 19.804 83.7655 19.804C84.0588 19.804 84.3228 19.788 84.5575 19.756C84.7975 19.724 85.0162 19.6733 85.2135 19.604C85.4162 19.5347 85.6055 19.4467 85.7815 19.34C85.9628 19.228 86.1415 19.092 86.3175 18.932C86.3708 18.884 86.4268 18.8467 86.4855 18.82C86.5442 18.788 86.6055 18.772 86.6695 18.772ZM95.4156 17.132L94.0076 13.284C93.9383 13.1133 93.8663 12.9107 93.7916 12.676C93.717 12.4413 93.6423 12.188 93.5676 11.916C93.4983 12.188 93.4263 12.444 93.3516 12.684C93.277 12.9187 93.205 13.124 93.1356 13.3L91.7356 17.132H95.4156ZM99.2156 21.5H97.5516C97.365 21.5 97.213 21.4547 97.0956 21.364C96.9783 21.268 96.8903 21.1507 96.8316 21.012L95.9676 18.652H91.1756L90.3116 21.012C90.269 21.1347 90.1863 21.2467 90.0636 21.348C89.941 21.4493 89.789 21.5 89.6076 21.5H87.9276L92.4796 9.932H94.6716L99.2156 21.5Z'
          fill='white'
        />
      </svg>
    </Link>
  );
};

export default Logo;
