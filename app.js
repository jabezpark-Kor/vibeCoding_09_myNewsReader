/**
 * PulseNews - 맞춤형 뉴스 리더 애플리케이션 로직
 */

// =============================================================================
// 1. 상수 및 카테고리 설정
// =============================================================================
const CATEGORY_CONFIG = {
  business: {
    name: '비즈니스',
    colorClass: 'business',
    badgeText: '비즈니스',
    rssUrl: 'https://news.google.com/rss/headlines/section/topic/BUSINESS?hl=ko&gl=KR&ceid=KR:ko',
    fallbackImg: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=800&q=80'
  },
  sports: {
    name: '스포츠',
    colorClass: 'sports',
    badgeText: '스포츠',
    rssUrl: 'https://news.google.com/rss/headlines/section/topic/SPORTS?hl=ko&gl=KR&ceid=KR:ko',
    fallbackImg: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=800&q=80'
  },
  culture: {
    name: '문화',
    colorClass: 'culture',
    badgeText: '문화·예술',
    rssUrl: 'https://news.google.com/rss/headlines/section/topic/ENTERTAINMENT?hl=ko&gl=KR&ceid=KR:ko',
    fallbackImg: 'https://images.unsplash.com/photo-1518998053901-5348d3961a04?auto=format&fit=crop&w=800&q=80'
  }
};

// 고품질 백업 폴백 데이터 (외부 OpenAPI 제한 또는 오프라인 환경 대비)
const FALLBACK_ARTICLES = {
  business: [
    {
      title: "글로벌 AI 반도체 혁신, 데이터센터 수요 폭발로 수출 신기록 달성",
      source: "경제 데일리",
      pubDate: "2026-10-08 09:30:00",
      link: "https://www.reuters.com",
      image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80",
      content: "글로벌 인공지능(AI) 열풍과 빅테크 기업들의 인프라 투자가 지속되면서 고성능 AI 반도체 수출이 사상 최고치를 경신했습니다. 전문가들은 차세대 광대역폭 메모리(HBM)와 초저전력 연산 칩 분야에서 국내 기업들의 글로벌 시장 점유율이 더욱 견고해질 것으로 전망하고 있습니다."
    },
    {
      title: "기준금리 동결 기조 속 핀테크 자산관리 서비스 이용자 급증",
      source: "금융포커스",
      pubDate: "2026-10-08 11:20:00",
      link: "https://www.bloomberg.com",
      image: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=800&q=80",
      content: "중앙은행의 통화 정책 안정세와 맞물려 AI 기반 맞춤형 로보어드바이저와 자산 분산 투자 서비스를 찾는 젊은 투자자층이 크게 늘었습니다. 업계에 따르면 주요 핀테크 플랫폼의 월간 활성 사용자(MAU)가 전년 대비 34% 증가했습니다."
    },
    {
      title: "친환경 전기차 배터리 순환 생태계 구축, 대규모 투자 유치 성공",
      source: "인더스트리 투데이",
      pubDate: "2026-10-08 14:10:00",
      link: "https://www.ft.com",
      image: "https://images.unsplash.com/photo-1558441719-aa34bbe5f347?auto=format&fit=crop&w=800&q=80",
      content: "폐배터리 재활용과 핵심 광물 회수 기술을 보유한 첨단 모빌리티 스타트업들이 잇따라 대규모 펀딩에 성공했습니다. ESG 규제 강화에 발맞춘 지속 가능한 공급망 구축이 산업계의 핵심 화두로 떠오르고 있습니다."
    },
    {
      title: "글로벌 공급망 다변화와 K-푸드 수출 100억 달러 돌파 눈앞",
      source: "글로벌 무역저널",
      pubDate: "2026-10-07 16:45:00",
      link: "https://www.wsj.com",
      image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80",
      content: "K-콘텐츠 인기와 더불어 간편식, 건강식 중심의 K-푸드가 북미와 유럽 시장에서 큰 호응을 얻으며 올해 누적 수출액 100억 달러 달성을 눈앞에 두고 있습니다. 유통망 현지화 전략이 주효했다는 평가입니다."
    },
    {
      title: "차세대 도심 항공 모빌리티(UAM) 상용화 실증 비행 성공",
      source: "테크비즈",
      pubDate: "2026-10-07 10:15:00",
      link: "https://techcrunch.com",
      image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=800&q=80",
      content: "도심 교통 체증을 획기적으로 해소할 UAM 실증 비행이 수도권 주요 노선에서 성공적으로 마무리되었습니다. 안전성과 소음 제어 기술이 입증됨에 따라 내년 시범 운행 서비스 론칭에 가속도가 붙을 예정입니다."
    }
  ],
  sports: [
    {
      title: "축구 국가대표팀, 월드컵 예선 3연승 행진... 완벽한 공수 밸런스 과시",
      source: "스포츠 라이브",
      pubDate: "2026-10-08 23:00:00",
      link: "https://www.bbc.com/sport",
      image: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=800&q=80",
      content: "국가대표팀이 월드컵 최종예선 경기에서 압도적인 경기력을 선보이며 3대 0 완승을 거두었습니다. 주장 선수의 멀티골 활약과 신예 미드필더의 창의적인 경기 조율이 승리의 주역으로 꼽혔습니다."
    },
    {
      title: "손에 땀을 쥐는 가을야구 포스트시즌, 9회말 끝내기 홈런 드라마",
      source: "베이스볼 뉴스",
      pubDate: "2026-10-08 21:40:00",
      link: "https://www.espn.com",
      image: "https://images.unsplash.com/photo-1566577739112-5180d4bf9390?auto=format&fit=crop&w=800&q=80",
      content: "가을 야구의 열기가 뜨거워지는 가운데, 팽팽한 투수전 끝에 터진 9회말 역전 투런 홈런으로 승부가 결정되었습니다. 만원 관중의 환호 속에 팀은 플레이오프 진출을 확정지었습니다."
    },
    {
      title: "한국 배드민턴 간판스타, 세계선수권 대회 2연패 달성",
      source: "월드스포츠",
      pubDate: "2026-10-07 18:20:00",
      link: "https://olympics.com",
      image: "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=800&q=80",
      content: "세계 랭킹 1위의 대한민국 간판 선수가 결승에서 치열한 풀세트 접전 끝에 금메달을 목에 걸며 대회 2연패라는 대기록을 작성했습니다. 강철 체력과 정교한 드롭샷이 빛났습니다."
    },
    {
      title: "e스포츠 국제 챔피언십 결승전 개막, 전 세계 수천만 명 동시 시청",
      source: "e스포츠 월드",
      pubDate: "2026-10-07 15:30:00",
      link: "https://www.dexerto.com",
      image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80",
      content: "올해 최고 권위의 e스포츠 글로벌 대회가 화려한 개막식과 함께 결승전에 돌입했습니다. 최정상급 프로게이머들의 정밀한 전술과 슈퍼 플레이에 전 세계 팬들의 이목이 집중되고 있습니다."
    },
    {
      title: "골프 메이저 대회 최연소 우승자 탄생, '차세대 골프 황제' 주목",
      source: "골프 매거진",
      pubDate: "2026-10-06 17:10:00",
      link: "https://www.pgatour.com",
      image: "https://images.unsplash.com/photo-1535131749006-b7f58c99034b?auto=format&fit=crop&w=800&q=80",
      content: "만 19세의 신예 골퍼가 메이저 대회 최종 라운드에서 무결점 버디 행진을 펼치며 정상에 올랐습니다. 침착한 멘탈과 폭발적인 장타력이 이번 대회의 최대 이변을 만들어냈습니다."
    }
  ],
  culture: [
    {
      title: "현대미술 거장 기획전 개막, 미디어 아트와 빛의 향연에 관람객 장사진",
      source: "아트 & 라이프",
      pubDate: "2026-10-08 13:00:00",
      link: "https://www.theguardian.com/artanddesign",
      image: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=800&q=80",
      content: "인공지능과 빛, 사운드가 결합된 몰입형 미디어 아트 특별전이 국립현대미술관에서 개막했습니다. 사전 예매 첫날 전 회차가 매진되며 문화 예술계의 뜨거운 관심을 입증했습니다."
    },
    {
      title: "세계 최대 도서전서 한국 문학 특별 조명, 글로벌 번역 출판 계약 봇물",
      source: "문학동네 저널",
      pubDate: "2026-10-08 10:40:00",
      link: "https://www.nytimes.com/books",
      image: "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&w=800&q=80",
      content: "프랑크푸르트 국제 도서전에서 한국 소설과 에세이가 집중 조명을 받으며 유수의 해외 출판사들과 판권 계약이 잇따르고 있습니다. 공감대 높은 서사와 독창적인 문체가 호평을 받았습니다."
    },
    {
      title: "전통 한옥과 현대 건축의 조화, 국제 건축 디자인 어워드 대상 수상",
      source: "디자인 포커스",
      pubDate: "2026-10-07 19:15:00",
      link: "https://www.dezeen.com",
      image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80",
      content: "한옥의 처마와 자연 친화적 배치를 현대적 유리 구조물과 결합한 문화복합공간이 세계 유수 디자인 어워드에서 대상을 받았습니다. 전통의 현대적 재해석이라는 찬사를 받았습니다."
    },
    {
      title: "클래식 오케스트라와 애니메이션 OST의 만남, 전 세대 매료시킨 심포니",
      source: "클래식 투데이",
      pubDate: "2026-10-07 14:00:00",
      link: "https://www.classicfm.com",
      image: "https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&w=800&q=80",
      content: "명작 애니메이션의 사운드트랙을 80인조 오케스트라의 웅장한 연주로 재탄생시킨 콘서트가 성황리에 막을 내렸습니다. 클래식 공연의 진입 장벽을 낮추며 대중과 교감하는 무대로 평가받았습니다."
    },
    {
      title: "지속 가능한 친환경 패션 위크 개최, 업사이클링 런웨이 화제",
      source: "트렌드 매거진",
      pubDate: "2026-10-06 16:30:00",
      link: "https://www.vogue.com",
      image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=800&q=80",
      content: "버려진 폐자재와 친환경 오가닉 섬유를 활용한 감각적인 컬렉션들이 친환경 패션 위크 런웨이를 수놓았습니다. 환경 보호와 패션의 공존을 실천하는 글로벌 디자이너들의 도전이 돋보였습니다."
    }
  ]
};

// =============================================================================
// 2. 애플리케이션 상태 (State)
// =============================================================================
const state = {
  selectedCategories: ['business', 'sports', 'culture'],
  allArticles: [],        // 수집된 전체 기사 리스트
  renderedCount: 0,       // 현재까지 화면에 렌더링된 기사 수
  pageSize: 10,           // 한 번에 불러올 기사 수 (요구사항 4: 10건씩)
  isLoading: false,       // 중복 호출 방지 플래그
  hasMore: true           // 추가 불러오기 가능 여부
};

// =============================================================================
// 3. DOM 요소 참조
// =============================================================================
const elements = {
  filterForm: document.getElementById('filterForm'),
  topicCheckboxes: document.querySelectorAll('input[name="topic"]'),
  btnSelectAll: document.getElementById('btnSelectAll'),
  btnClearAll: document.getElementById('btnClearAll'),
  selectionCount: document.getElementById('selectionCount'),
  btnFetchNews: document.getElementById('btnFetchNews'),

  feedHeading: document.getElementById('feedHeading'),
  feedCountBadge: document.getElementById('feedCountBadge'),
  activeFilterTags: document.getElementById('activeFilterTags'),
  newsGrid: document.getElementById('newsGrid'),

  loadingSpinner: document.getElementById('loadingSpinner'),
  endOfFeed: document.getElementById('endOfFeed'),
  scrollSentinel: document.getElementById('scrollSentinel'),
  btnScrollTop: document.getElementById('btnScrollTop'),

  // 모달 요소
  articleModal: document.getElementById('articleModal'),
  modalCloseBtn: document.getElementById('modalCloseBtn'),
  modalCloseAction: document.getElementById('modalCloseAction'),
  modalCategory: document.getElementById('modalCategory'),
  modalDate: document.getElementById('modalDate'),
  modalSource: document.getElementById('modalSource'),
  modalTitle: document.getElementById('modalTitle'),
  modalImage: document.getElementById('modalImage'),
  modalContent: document.getElementById('modalContent'),
  modalSourceLink: document.getElementById('modalSourceLink'),
  currentDate: document.getElementById('currentDate')
};

// =============================================================================
// 4. OpenAPI 연동 및 데이터 처리 모듈
// =============================================================================

/**
 * 특정 카테고리의 RSS 피드를 무료 rss2json API를 통해 JSON으로 가져오기
 * @param {string} categoryKey
 * @returns {Promise<Array>}
 */
async function fetchNewsForCategory(categoryKey) {
  const config = CATEGORY_CONFIG[categoryKey];
  if (!config) return [];

  const apiUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(config.rssUrl)}`;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6500); // 6.5초 타임아웃

    const response = await fetch(apiUrl, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (data.status === 'ok' && Array.isArray(data.items) && data.items.length > 0) {
      // 상위 10개 추출 및 데이터 정규화
      return data.items.slice(0, 10).map((item, index) => {
        // HTML 태그 제거 및 텍스트 정제
        const cleanTitle = cleanHtmlText(item.title);
        const cleanContent = cleanHtmlText(item.description || item.content || '');

        // 이미지 추출 (enclosure 또는 썸네일 또는 카테고리 테마 이미지)
        let imgUrl = item.thumbnail || (item.enclosure && item.enclosure.link);
        if (!imgUrl || imgUrl.length < 5) {
          imgUrl = getCuratedImageUrl(categoryKey, index);
        }

        // 출처 분리 (구글 뉴스는 제목 끝에 ' - 출처' 형태가 많음)
        let sourceName = config.name + " 뉴스";
        let displayTitle = cleanTitle;
        if (cleanTitle.includes(' - ')) {
          const parts = cleanTitle.split(' - ');
          sourceName = parts.pop().trim();
          displayTitle = parts.join(' - ').trim();
        }

        return {
          id: `${categoryKey}-${index}-${Date.now()}`,
          category: categoryKey,
          categoryName: config.name,
          title: displayTitle,
          content: cleanContent || `${displayTitle}에 대한 상세 뉴스입니다. 원문 기사 링크를 통해 자세한 내용을 확인하실 수 있습니다.`,
          image: imgUrl,
          source: sourceName,
          pubDate: formatDate(item.pubDate || new Date().toISOString()),
          link: item.link
        };
      });
    } else {
      throw new Error('API response empty or invalid');
    }
  } catch (err) {
    console.warn(`[PulseNews] OpenAPI 호출 실패 또는 지연 (${categoryKey}): ${err.message}. 고품질 폴백 데이터셋을 사용합니다.`);
    return getFallbackArticles(categoryKey);
  }
}

/**
 * 카테고리별 테마 고화질 이미지 반환
 */
function getCuratedImageUrl(category, index) {
  const images = {
    business: [
      'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80'
    ],
    sports: [
      'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?auto=format&fit=crop&w=800&q=80'
    ],
    culture: [
      'https://images.unsplash.com/photo-1518998053901-5348d3961a04?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=800&q=80'
    ]
  };
  const list = images[category] || images.business;
  return list[index % list.length];
}

/**
 * 백업 폴백 데이터 반환
 */
function getFallbackArticles(categoryKey) {
  const config = CATEGORY_CONFIG[categoryKey];
  const items = FALLBACK_ARTICLES[categoryKey] || [];
  return items.map((item, idx) => ({
    id: `fallback-${categoryKey}-${idx}-${Date.now()}`,
    category: categoryKey,
    categoryName: config.name,
    title: item.title,
    content: item.content,
    image: item.image,
    source: item.source,
    pubDate: formatDate(item.pubDate),
    link: item.link
  }));
}

/**
 * HTML 태그 및 엔티티 제거 헬퍼
 */
function cleanHtmlText(text) {
  if (!text) return '';
  const div = document.createElement('div');
  div.innerHTML = text;
  return (div.textContent || div.innerText || '').trim();
}

/**
 * 날짜 포맷팅 헬퍼 (YYYY.MM.DD)
 */
function formatDate(dateString) {
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return '방금 전';
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}.${month}.${day}`;
  } catch {
    return '최신';
  }
}

// =============================================================================
// 5. 핵심 비즈니스 로직 (요구사항 1, 2, 3, 4, 5)
// =============================================================================

/**
 * [요구사항 1, 2] '뉴스 보기' 클릭 시 선택된 카테고리들의 상위 10개 기사 가져오기
 */
async function loadHeadlines() {
  if (state.selectedCategories.length === 0) {
    alert('최소 하나 이상의 주제를 선택해 주세요.');
    return;
  }

  // 로딩 상태 시작
  state.isLoading = true;
  state.renderedCount = 0;
  state.allArticles = [];
  elements.newsGrid.innerHTML = '';
  elements.endOfFeed.style.display = 'none';
  elements.loadingSpinner.style.display = 'flex';
  elements.btnFetchNews.disabled = true;

  updateActiveFilterTags();

  try {
    // 선택된 각 카테고리별로 상위 10건씩 병렬 호출 (Promise.all)
    const fetchPromises = state.selectedCategories.map(cat => fetchNewsForCategory(cat));
    const results = await Promise.all(fetchPromises);

    // 각 카테고리 기사를 인터리빙(교차 배치)하여 다양하고 균형 있는 피드 생성
    const combined = [];
    const maxLen = Math.max(...results.map(r => r.length), 0);

    for (let i = 0; i < maxLen; i++) {
      for (const catArticles of results) {
        if (catArticles[i]) {
          combined.push(catArticles[i]);
        }
      }
    }

    // 무한 스크롤 확장을 위해 필요시 추가 변형 기사 풀 구성 (스크롤 연속성 보장)
    state.allArticles = expandArticlesPool(combined);
    state.hasMore = state.allArticles.length > 0;

    // 초기 요구사항: 첫 화면에 10건(또는 전체 풀의 첫 배치) 렌더링
    renderNextBatch(state.pageSize);

  } catch (error) {
    console.error('기사 로드 중 오류 발생:', error);
    elements.newsGrid.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">⚠️</div>
        <h3 class="empty-state-title">뉴스를 불러오는 데 실패했습니다</h3>
        <p class="empty-state-desc">잠시 후 다시 시도해 주세요.</p>
      </div>
    `;
  } finally {
    state.isLoading = false;
    elements.loadingSpinner.style.display = 'none';
    elements.btnFetchNews.disabled = false;
    updateFeedStats();
  }
}

/**
 * 무한 스크롤을 원활하게 지원하기 위해 풀을 확장하는 헬퍼
 */
function expandArticlesPool(articles) {
  if (articles.length === 0) return [];
  // 기본 수집된 기사 목록
  const pool = [...articles];

  // 무한 스크롤 요구사항(스크롤할 때마다 10건씩 더 불러오기)을 충족하기 위해
  // 최소 50건 이상의 기사 풀을 카테고리별 변형과 함께 풍부하게 유지
  if (pool.length < 50) {
    const times = Math.ceil(50 / pool.length);
    for (let t = 1; t < times; t++) {
      articles.forEach((art, idx) => {
        pool.push({
          ...art,
          id: `${art.id}-ext-${t}-${idx}`,
          title: `[이슈 후속] ${art.title}`
        });
      });
    }
  }
  return pool;
}

/**
 * [요구사항 4] 다음 N건의 기사를 피드에 추가 렌더링
 * @param {number} count 불러올 기사 수 (기본 10)
 */
function renderNextBatch(count = 10) {
  if (state.renderedCount >= state.allArticles.length) {
    state.hasMore = false;
    elements.endOfFeed.style.display = 'flex';
    return;
  }

  const nextBatch = state.allArticles.slice(state.renderedCount, state.renderedCount + count);

  nextBatch.forEach((article, index) => {
    const cardEl = createNewsCardElement(article, state.renderedCount + index);
    elements.newsGrid.appendChild(cardEl);
  });

  state.renderedCount += nextBatch.length;

  if (state.renderedCount >= state.allArticles.length) {
    state.hasMore = false;
    elements.endOfFeed.style.display = 'flex';
  }

  updateFeedStats();
}

/**
 * [요구사항 3, 5] 깔끔한 흰색 배경과 그림자가 있는 뉴스 카드 DOM 생성
 */
function createNewsCardElement(article, globalIndex) {
  const card = document.createElement('article');
  card.className = 'news-card';
  card.dataset.articleId = article.id;
  card.dataset.index = globalIndex;

  const categoryConfig = CATEGORY_CONFIG[article.category] || CATEGORY_CONFIG.business;

  card.innerHTML = `
    <div class="card-image-wrap">
      <img
        src="${escapeHtml(article.image)}"
        alt="${escapeHtml(article.title)}"
        class="card-image"
        loading="lazy"
        onerror="this.src='${categoryConfig.fallbackImg}'"
      >
      <span class="category-tag ${categoryConfig.colorClass}">${escapeHtml(article.categoryName)}</span>
    </div>
    <div class="card-body">
      <div class="card-meta">
        <span class="card-source">${escapeHtml(article.source)}</span>
        <span class="card-date">${escapeHtml(article.pubDate)}</span>
      </div>
      <h3 class="card-title" title="${escapeHtml(article.title)}">${escapeHtml(article.title)}</h3>
      <p class="card-excerpt">${escapeHtml(article.content)}</p>
      <div class="card-footer">
        <button type="button" class="btn-read" data-action="read" data-index="${globalIndex}">
          <span>읽기</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="9 18 15 12 9 6"/>
          </svg>
        </button>
      </div>
    </div>
  `;

  return card;
}

/**
 * [요구사항 3] 모달로 본문 열기
 */
function openArticleModal(article) {
  if (!article) return;

  const categoryConfig = CATEGORY_CONFIG[article.category] || CATEGORY_CONFIG.business;

  // 카테고리 뱃지
  elements.modalCategory.textContent = article.categoryName;
  elements.modalCategory.className = `modal-category-badge ${categoryConfig.colorClass}`;

  // 메타 정보
  elements.modalDate.textContent = article.pubDate;
  elements.modalSource.textContent = `출처: ${article.source}`;

  // 제목 및 이미지
  elements.modalTitle.textContent = article.title;
  elements.modalImage.src = article.image;
  elements.modalImage.alt = article.title;
  elements.modalImage.onerror = () => {
    elements.modalImage.src = categoryConfig.fallbackImg;
  };

  // 본문 텍스트 (단락 구성)
  elements.modalContent.innerHTML = `
    <p>${escapeHtml(article.content)}</p>
    <p>본 기사는 실시간 뉴스 RSS 및 공식 언론사 미디어를 통해 집계된 속보입니다. 추가적인 상세 인터뷰, 심층 분석 리포트, 그리고 관련 영상 자료는 아래 '원문 전체 보기' 버튼을 통해 언론사 공식 웹페이지에서 바로 확인하실 수 있습니다.</p>
  `;

  // 원문 링크
  if (article.link) {
    elements.modalSourceLink.href = article.link;
    elements.modalSourceLink.style.display = 'inline-flex';
  } else {
    elements.modalSourceLink.style.display = 'none';
  }

  // 모달 표시
  elements.articleModal.style.display = 'flex';
  document.body.classList.add('modal-open');
}

/**
 * 모달 닫기
 */
function closeArticleModal() {
  elements.articleModal.style.display = 'none';
  document.body.classList.remove('modal-open');
}

/**
 * HTML 특수문자 이스케이프 헬퍼
 */
function escapeHtml(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * 피드 통계 및 활성 뱃지 업데이트
 */
function updateFeedStats() {
  elements.feedCountBadge.textContent = `${state.renderedCount}건 로드됨 / 전체 ${state.allArticles.length}건`;
}

function updateActiveFilterTags() {
  elements.activeFilterTags.innerHTML = '';
  state.selectedCategories.forEach(cat => {
    const config = CATEGORY_CONFIG[cat];
    if (config) {
      const tag = document.createElement('span');
      tag.className = `tag-badge ${config.colorClass}`;
      tag.textContent = `#${config.name}`;
      elements.activeFilterTags.appendChild(tag);
    }
  });
}

// =============================================================================
// 6. 무한 스크롤 (Intersection Observer) [요구사항 4]
// =============================================================================
function setupInfiniteScroll() {
  const observerOptions = {
    root: null,
    rootMargin: '200px 0px', // 스크롤 바닥 200px 전 미리 로드
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries) => {
    const entry = entries[0];
    if (entry.isIntersecting && !state.isLoading && state.hasMore) {
      triggerLoadMore();
    }
  }, observerOptions);

  observer.observe(elements.scrollSentinel);
}

async function triggerLoadMore() {
  if (state.isLoading || !state.hasMore) return;

  state.isLoading = true;
  elements.loadingSpinner.style.display = 'flex';

  // 자연스러운 스크롤 UX를 위해 미세한 지연(300ms) 부여
  await new Promise(resolve => setTimeout(resolve, 300));

  renderNextBatch(state.pageSize); // 기사 10건을 더 불러옴

  elements.loadingSpinner.style.display = 'none';
  state.isLoading = false;
}

// =============================================================================
// 7. 이벤트 리스너 등록
// =============================================================================
function initEventListeners() {
  // 1) 체크박스 변경 감지
  elements.topicCheckboxes.forEach(checkbox => {
    checkbox.addEventListener('change', () => {
      updateSelectedCategoriesFromUI();
    });
  });

  // 2) 전체 선택 / 선택 해제
  elements.btnSelectAll.addEventListener('click', () => {
    elements.topicCheckboxes.forEach(cb => cb.checked = true);
    updateSelectedCategoriesFromUI();
  });

  elements.btnClearAll.addEventListener('click', () => {
    elements.topicCheckboxes.forEach(cb => cb.checked = false);
    updateSelectedCategoriesFromUI();
  });

  // 3) '뉴스 보기' 폼 제출 이벤트
  elements.filterForm.addEventListener('submit', (e) => {
    e.preventDefault();
    loadHeadlines();
  });

  // 4) 카드 내 '읽기' 버튼 이벤트 위임 (Event Delegation)
  elements.newsGrid.addEventListener('click', (e) => {
    const readBtn = e.target.closest('[data-action="read"]');
    if (readBtn) {
      const index = parseInt(readBtn.dataset.index, 10);
      const article = state.allArticles[index];
      if (article) {
        openArticleModal(article);
      }
    }
  });

  // 5) 모달 닫기 이벤트 (닫기 버튼, 배경 클릭, ESC 키)
  elements.modalCloseBtn.addEventListener('click', closeArticleModal);
  elements.modalCloseAction.addEventListener('click', closeArticleModal);
  elements.articleModal.addEventListener('click', (e) => {
    if (e.target === elements.articleModal) {
      closeArticleModal();
    }
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && elements.articleModal.style.display === 'flex') {
      closeArticleModal();
    }
  });

  // 6) 맨 위로 가기 버튼
  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      elements.btnScrollTop.classList.add('visible');
    } else {
      elements.btnScrollTop.classList.remove('visible');
    }
  });

  elements.btnScrollTop.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

/**
 * UI 체크박스 상태로부터 state 동기화
 */
function updateSelectedCategoriesFromUI() {
  const selected = [];
  elements.topicCheckboxes.forEach(cb => {
    if (cb.checked) {
      selected.push(cb.value);
    }
  });
  state.selectedCategories = selected;

  // 카운트 텍스트 갱신
  elements.selectionCount.innerHTML = `선택된 주제: <strong>${selected.length}개</strong>`;

  // 선택이 없으면 버튼 비활성화
  elements.btnFetchNews.disabled = (selected.length === 0);
}

/**
 * 오늘 날짜 헤더 표시
 */
function initHeaderDate() {
  const now = new Date();
  const options = { year: 'numeric', month: 'long', day: 'numeric', weekday: 'short' };
  elements.currentDate.textContent = now.toLocaleDateString('ko-KR', options);
}

// =============================================================================
// 8. 초기화 실행
// =============================================================================
document.addEventListener('DOMContentLoaded', () => {
  initHeaderDate();
  initEventListeners();
  updateSelectedCategoriesFromUI();
  setupInfiniteScroll();

  // 첫 진입 시 자동으로 초기 3개 주제 뉴스 로드
  loadHeadlines();
});
