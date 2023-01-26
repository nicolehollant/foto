<template>
  <div>
    <div class="flex items-center bg-neutral-800">
      <SenpTextInput v-model="filter" :classes="{ wrapper: { base: 'relative w-full' }, input: { extend: 'pr-6' } }">
        <template #hint>
          <div class="absolute inset-y-0 right-2 flex items-center">
            <Icon name="mdi:search"></Icon>
          </div>
        </template>
      </SenpTextInput>
    </div>
    <div class="mt-2 grid grid-cols-4 w-full p-4 gap-2 rounded-lg bg-neutral-800 border border-neutral-700">
      <button
        class="w-full h-full"
        v-for="icon in filtered"
        :key="icon.name"
        @click="() => $emit('update:icon', icon.icon)"
      >
        <Icon :name="icon.icon" class="text-[32px]"></Icon>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
defineEmits<{
  (event: 'update:icon', value: string): void
}>()

const filter = ref('')
const filtered = computed(() => {
  if (!filter.value) {
    return icons
  }
  return icons.filter((icon) => icon.name.replaceAll('-', ' ').startsWith(filter.value.toLowerCase()))
})

const icons = [
  {
    icon: 'fa6-brands:42-group',
    name: '42-group',
  },
  {
    icon: 'fa6-brands:accessible-icon',
    name: 'accessible-icon',
  },
  {
    icon: 'fa6-brands:adversal',
    name: 'adversal',
  },
  {
    icon: 'fa6-brands:airbnb',
    name: 'airbnb',
  },
  {
    icon: 'fa6-brands:alipay',
    name: 'alipay',
  },
  {
    icon: 'fa6-brands:amazon',
    name: 'amazon',
  },
  {
    icon: 'fa6-brands:amazon-pay',
    name: 'amazon-pay',
  },
  {
    icon: 'fa6-brands:android',
    name: 'android',
  },
  {
    icon: 'fa6-brands:angellist',
    name: 'angellist',
  },
  {
    icon: 'fa6-brands:app-store-ios',
    name: 'app-store-ios',
  },
  {
    icon: 'fa6-brands:apple',
    name: 'apple',
  },
  {
    icon: 'fa6-brands:apple-pay',
    name: 'apple-pay',
  },
  {
    icon: 'fa6-brands:audible',
    name: 'audible',
  },
  {
    icon: 'fa6-brands:aws',
    name: 'aws',
  },
  {
    icon: 'fa6-brands:bandcamp',
    name: 'bandcamp',
  },
  {
    icon: 'fa6-brands:bitbucket',
    name: 'bitbucket',
  },
  {
    icon: 'fa6-brands:bluetooth',
    name: 'bluetooth',
  },
  {
    icon: 'fa6-brands:btc',
    name: 'btc',
  },
  {
    icon: 'fa6-brands:canadian-maple-leaf',
    name: 'canadian-maple-leaf',
  },
  {
    icon: 'fa6-brands:cc-amazon-pay',
    name: 'cc-amazon-pay',
  },
  {
    icon: 'fa6-brands:cc-amex',
    name: 'cc-amex',
  },
  {
    icon: 'fa6-brands:cc-apple-pay',
    name: 'cc-apple-pay',
  },
  {
    icon: 'fa6-brands:cc-diners-club',
    name: 'cc-diners-club',
  },
  {
    icon: 'fa6-brands:cc-discover',
    name: 'cc-discover',
  },
  {
    icon: 'fa6-brands:cc-jcb',
    name: 'cc-jcb',
  },
  {
    icon: 'fa6-brands:cc-mastercard',
    name: 'cc-mastercard',
  },
  {
    icon: 'fa6-brands:cc-paypal',
    name: 'cc-paypal',
  },
  {
    icon: 'fa6-brands:cc-stripe',
    name: 'cc-stripe',
  },
  {
    icon: 'fa6-brands:cc-visa',
    name: 'cc-visa',
  },
  {
    icon: 'fa6-brands:chrome',
    name: 'chrome',
  },
  {
    icon: 'fa6-brands:chromecast',
    name: 'chromecast',
  },
  {
    icon: 'fa6-brands:codepen',
    name: 'codepen',
  },
  {
    icon: 'fa6-brands:confluence',
    name: 'confluence',
  },
  {
    icon: 'fa6-brands:creative-commons',
    name: 'creative-commons',
  },
  {
    icon: 'fa6-brands:css3',
    name: 'css3',
  },
  {
    icon: 'fa6-brands:d-and-d',
    name: 'd-and-d',
  },
  {
    icon: 'fa6-brands:dailymotion',
    name: 'dailymotion',
  },
  {
    icon: 'fa6-brands:dev',
    name: 'dev',
  },
  {
    icon: 'fa6-brands:deviantart',
    name: 'deviantart',
  },
  {
    icon: 'fa6-brands:diaspora',
    name: 'diaspora',
  },
  {
    icon: 'fa6-brands:digg',
    name: 'digg',
  },
  {
    icon: 'fa6-brands:digital-ocean',
    name: 'digital-ocean',
  },
  {
    icon: 'fa6-brands:discord',
    name: 'discord',
  },
  {
    icon: 'fa6-brands:docker',
    name: 'docker',
  },
  {
    icon: 'fa6-brands:dribbble',
    name: 'dribbble',
  },
  {
    icon: 'fa6-brands:dropbox',
    name: 'dropbox',
  },
  {
    icon: 'fa6-brands:ebay',
    name: 'ebay',
  },
  {
    icon: 'fa6-brands:ethereum',
    name: 'ethereum',
  },
  {
    icon: 'fa6-brands:etsy',
    name: 'etsy',
  },
  {
    icon: 'fa6-brands:evernote',
    name: 'evernote',
  },
  {
    icon: 'fa6-brands:facebook',
    name: 'facebook',
  },
  {
    icon: 'fa6-brands:facebook-messenger',
    name: 'facebook-messenger',
  },
  {
    icon: 'fa6-brands:fedex',
    name: 'fedex',
  },
  {
    icon: 'fa6-brands:figma',
    name: 'figma',
  },
  {
    icon: 'fa6-brands:firefox-browser',
    name: 'firefox-browser',
  },
  {
    icon: 'fa6-brands:flickr',
    name: 'flickr',
  },
  {
    icon: 'fa6-brands:flipboard',
    name: 'flipboard',
  },
  {
    icon: 'fa6-brands:fly',
    name: 'fly',
  },
  {
    icon: 'fa6-brands:foursquare',
    name: 'foursquare',
  },
  {
    icon: 'fa6-brands:git-alt',
    name: 'git-alt',
  },
  {
    icon: 'fa6-brands:github',
    name: 'github',
  },
  {
    icon: 'fa6-brands:google',
    name: 'google',
  },
  {
    icon: 'fa6-brands:google-drive',
    name: 'google-drive',
  },
  {
    icon: 'fa6-brands:google-pay',
    name: 'google-pay',
  },
  {
    icon: 'fa6-brands:google-play',
    name: 'google-play',
  },
  {
    icon: 'fa6-brands:google-plus',
    name: 'google-plus',
  },
  {
    icon: 'fa6-brands:google-plus-g',
    name: 'google-plus-g',
  },
  {
    icon: 'fa6-brands:google-wallet',
    name: 'google-wallet',
  },
  {
    icon: 'fa6-brands:hacker-news',
    name: 'hacker-news',
  },
  {
    icon: 'fa6-brands:html5',
    name: 'html5',
  },
  {
    icon: 'fa6-brands:imdb',
    name: 'imdb',
  },
  {
    icon: 'fa6-brands:instagram',
    name: 'instagram',
  },
  {
    icon: 'fa6-brands:invision',
    name: 'invision',
  },
  {
    icon: 'fa6-brands:itch-io',
    name: 'itch-io',
  },
  {
    icon: 'fa6-brands:jira',
    name: 'jira',
  },
  {
    icon: 'fa6-brands:js',
    name: 'js',
  },
  {
    icon: 'fa6-brands:jsfiddle',
    name: 'jsfiddle',
  },
  {
    icon: 'fa6-brands:kaggle',
    name: 'kaggle',
  },
  {
    icon: 'fa6-brands:kickstarter',
    name: 'kickstarter',
  },
  {
    icon: 'fa6-brands:lastfm',
    name: 'lastfm',
  },
  {
    icon: 'fa6-brands:linkedin',
    name: 'linkedin',
  },
  {
    icon: 'fa6-brands:linux',
    name: 'linux',
  },
  {
    icon: 'fa6-brands:lyft',
    name: 'lyft',
  },
  {
    icon: 'fa6-brands:magento',
    name: 'magento',
  },
  {
    icon: 'fa6-brands:mailchimp',
    name: 'mailchimp',
  },
  {
    icon: 'fa6-brands:mastodon',
    name: 'mastodon',
  },
  {
    icon: 'fa6-brands:medium',
    name: 'medium',
  },
  {
    icon: 'fa6-brands:meta',
    name: 'meta',
  },
  {
    icon: 'fa6-brands:microsoft',
    name: 'microsoft',
  },
  {
    icon: 'fa6-brands:napster',
    name: 'napster',
  },
  {
    icon: 'fa6-brands:nfc-symbol',
    name: 'nfc-symbol',
  },
  {
    icon: 'fa6-brands:node-js',
    name: 'node-js',
  },
  {
    icon: 'fa6-brands:npm',
    name: 'npm',
  },
  {
    icon: 'fa6-brands:patreon',
    name: 'patreon',
  },
  {
    icon: 'fa6-brands:paypal',
    name: 'paypal',
  },
  {
    icon: 'fa6-brands:periscope',
    name: 'periscope',
  },
  {
    icon: 'fa6-brands:pinterest',
    name: 'pinterest',
  },
  {
    icon: 'fa6-brands:playstation',
    name: 'playstation',
  },
  {
    icon: 'fa6-brands:react',
    name: 'react',
  },
  {
    icon: 'fa6-brands:reddit',
    name: 'reddit',
  },
  {
    icon: 'fa6-brands:shopify',
    name: 'shopify',
  },
  {
    icon: 'fa6-brands:sketch',
    name: 'sketch',
  },
  {
    icon: 'fa6-brands:skype',
    name: 'skype',
  },
  {
    icon: 'fa6-brands:slack',
    name: 'slack',
  },
  {
    icon: 'fa6-brands:snapchat',
    name: 'snapchat',
  },
  {
    icon: 'fa6-brands:soundcloud',
    name: 'soundcloud',
  },
  {
    icon: 'fa6-brands:spotify',
    name: 'spotify',
  },
  {
    icon: 'fa6-brands:squarespace',
    name: 'squarespace',
  },
  {
    icon: 'fa6-brands:stack-overflow',
    name: 'stack-overflow',
  },
  {
    icon: 'fa6-brands:steam',
    name: 'steam',
  },
  {
    icon: 'fa6-brands:strava',
    name: 'strava',
  },
  {
    icon: 'fa6-brands:stripe',
    name: 'stripe',
  },
  {
    icon: 'fa6-brands:tiktok',
    name: 'tiktok',
  },
  {
    icon: 'fa6-brands:tumblr',
    name: 'tumblr',
  },
  {
    icon: 'fa6-brands:twitch',
    name: 'twitch',
  },
  {
    icon: 'fa6-brands:twitter',
    name: 'twitter',
  },
  {
    icon: 'fa6-brands:unsplash',
    name: 'unsplash',
  },
  {
    icon: 'fa6-brands:vimeo-v',
    name: 'vimeo-v',
  },
  {
    icon: 'fa6-brands:vine',
    name: 'vine',
  },
  {
    icon: 'fa6-brands:weebly',
    name: 'weebly',
  },
  {
    icon: 'fa6-brands:whatsapp',
    name: 'whatsapp',
  },
  {
    icon: 'fa6-brands:windows',
    name: 'windows',
  },
  {
    icon: 'fa6-brands:wix',
    name: 'wix',
  },
  {
    icon: 'fa6-brands:xbox',
    name: 'xbox',
  },
  {
    icon: 'fa6-brands:yelp',
    name: 'yelp',
  },
  {
    icon: 'fa6-brands:youtube',
    name: 'youtube',
  },
]
</script>
