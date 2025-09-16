// ===== فنجان ديسكفري - موقع تحت الصيانة =====

// ===== متغيرات عامة =====
let userAnswers = {};

// ===== دالة عرض النتيجة =====
function displayRecommendation() {
    // عرض اقتراحين حقيقيين للقهوة
    const recommendations = [
        {
            name: 'لاتيه كريمي',
            description: 'مشروب دافئ مع حليب فومي ناعم ونكهة قهوة متوازنة',
            image: 'images/hot/latte.png'
        },
        {
            name: 'كولد بريو منعش',
            description: 'قهوة باردة منقوعة طوال الليل مع نكهة قوية ونظيفة',
            image: 'images/cold/Cold Brew.png'
        }
    ];
    
    // إخفاء العناصر القديمة
    const coffeeImage = document.getElementById('coffee-image');
    const coffeeName = document.getElementById('coffee-name');
    const coffeeDescription = document.getElementById('coffee-description');
    
    if (coffeeImage) coffeeImage.style.display = 'none';
    if (coffeeName) coffeeName.style.display = 'none';
    if (coffeeDescription) coffeeDescription.style.display = 'none';
    
    // إنشاء حاوية التوصيات
    const recommendationContainer = document.querySelector('.recommendation');
    if (recommendationContainer) {
        recommendationContainer.innerHTML = '';
        
        recommendations.forEach((rec, index) => {
            const recCard = document.createElement('div');
            recCard.className = 'recommendation-card';
            recCard.innerHTML = `
                <div class="recommendation-image">
                    <img src="${rec.image}" alt="${rec.name}" />
                </div>
                <div class="recommendation-info">
                    <div class="coffee-name">${rec.name}</div>
                    <div class="coffee-description">${rec.description}</div>
                </div>
            `;
            recommendationContainer.appendChild(recCard);
            
            // إضافة كلمة "أو" بين البطاقتين
            if (index === 0) {
                const orElement = document.createElement('div');
                orElement.className = 'recommendation-or';
                orElement.textContent = 'أو';
                recommendationContainer.appendChild(orElement);
            }
        });
    }
    
}

// ===== دالة تحديث زر الإرسال =====
function updateSubmitButton() {
    const allQuestions = ['contains-coffee', 'sweetness-level', 'milk-amount', 'coffee-strength', 'flavors', 'temperature'];
    const allAnswered = allQuestions.every(question => userAnswers[question]);
    const submitBtn = document.getElementById('submit-btn');
    if (submitBtn) {
        submitBtn.disabled = !allAnswered;
    }
}


// ===== إعداد صفحة الاختبار =====
function setupQuizPage() {
    const optionButtons = document.querySelectorAll('.option-btn');
    const submitButton = document.getElementById('submit-btn');
    const quizForm = document.getElementById('coffee-quiz');
    const nextBtn = document.getElementById('next-btn');
    const backBtn = document.getElementById('back-btn');
    const questionGroups = quizForm ? quizForm.querySelectorAll('.question-group') : [];
    const quizCard = document.querySelector('.quiz-form');
    const simpleNav = document.querySelector('.simple-nav');
    const progressFill = document.getElementById('progress-fill');
    const currentStepSpan = document.getElementById('current-step');
    const totalStepsSpan = document.getElementById('total-steps');
    let currentStep = 0;
    let startX = 0;
    let startY = 0;

    function getQuestionKeyForGroup(group) {
        const firstOption = group.querySelector('.option-btn');
        return firstOption ? firstOption.getAttribute('data-question') : null;
    }

    function isCurrentStepAnswered() {
        const group = questionGroups[currentStep];
        const key = getQuestionKeyForGroup(group);
        return key ? Boolean(userAnswers[key]) : true;
    }

    function updateNavState() {
        // تحديث أزرار التنقل
        if (backBtn) {
            const onFirst = currentStep === 0;
            backBtn.disabled = onFirst;
            backBtn.style.display = onFirst ? 'none' : 'flex';
        }
        const isLast = currentStep === questionGroups.length - 1;
        if (nextBtn) {
            nextBtn.style.display = isLast ? 'none' : 'flex';
            nextBtn.disabled = !isCurrentStepAnswered();
        }
        if (submitButton) {
            submitButton.style.display = isLast ? 'block' : 'none';
            updateSubmitButton();
        }
        if (simpleNav) {
            simpleNav.style.display = isLast ? 'none' : 'flex';
        }
        
        // تحديث شريط التقدم والنص
        if (totalStepsSpan) totalStepsSpan.textContent = questionGroups.length;
        const percent = ((currentStep) / (questionGroups.length - 1)) * 100;
        if (progressFill) progressFill.style.width = Math.max(0, Math.min(100, percent)) + '%';
        if (currentStepSpan) currentStepSpan.textContent = currentStep + 1;
    }

    function showStep(index) {
        if (index < 0 || index >= questionGroups.length) return;
        
        const currentGroup = questionGroups[currentStep];
        const nextGroup = questionGroups[index];
        
        if (currentGroup && nextGroup && currentStep !== index) {
            // تأثير انتقال سلس على السؤال فقط
            currentGroup.style.transition = 'opacity 0.2s ease, transform 0.2s ease';
            currentGroup.style.opacity = '0';
            currentGroup.style.transform = 'translateY(10px)';
            
            setTimeout(() => {
                // إخفاء السؤال الحالي وإظهار الجديد
                questionGroups.forEach((group, i) => {
                    group.style.display = i === index ? 'block' : 'none';
                });
                
                // إعداد السؤال الجديد للظهور
                nextGroup.style.opacity = '0';
                nextGroup.style.transform = 'translateY(-10px)';
                
                // إظهار السؤال الجديد بسلاسة
                setTimeout(() => {
                    nextGroup.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                    nextGroup.style.opacity = '1';
                    nextGroup.style.transform = 'translateY(0)';
                    
                    // إعادة تعيين الانتقالات
                    setTimeout(() => {
                        currentGroup.style.transition = '';
                        nextGroup.style.transition = '';
                    }, 300);
                }, 50);
            }, 200);
        } else {
            // نسخة احتياطية بدون تأثيرات
            questionGroups.forEach((group, i) => {
                group.style.display = i === index ? 'block' : 'none';
            });
        }

        currentStep = index;
        updateNavState();
    }
    
    optionButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const question = this.getAttribute('data-question');
            const value = this.getAttribute('data-value');
            
            // التحقق من أن الزر محدد بالفعل
            if (this.classList.contains('selected')) {
                // إلغاء التحديد
                this.classList.remove('selected');
                delete userAnswers[question];
            } else {
                // إزالة التحديد من الأزرار الأخرى لنفس السؤال
                document.querySelectorAll(`.option-btn[data-question="${question}"]`).forEach(otherBtn => {
                    otherBtn.classList.remove('selected');
                });
                
                // تحديد الزر المختار
                this.classList.add('selected');
                userAnswers[question] = value;
            }
            
            updateSubmitButton();
            // تحديث حالة الأزرار فور الاختيار
            updateNavState();
        });
    });
    
    if (nextBtn) {
        nextBtn.addEventListener('click', function() {
            if (currentStep < questionGroups.length - 1) {
                showStep(currentStep + 1);
            }
        });
    }

    if (backBtn) {
        backBtn.addEventListener('click', function() {
            if (currentStep > 0) {
                showStep(currentStep - 1);
            }
        });
    }

    if (quizForm) {
        quizForm.addEventListener('submit', function(e) {
            e.preventDefault();
            if (Object.keys(userAnswers).length === 6) {
                // حفظ الإجابات (رغم أن النتيجة ثابتة)
                localStorage.setItem('coffeeAnswers', JSON.stringify(userAnswers));
                // عرض صفحة التحميل
                showLoadingScreen();
            }
        });
    }

    // إضافة دعم Swipe
    if (quizCard) {
        quizCard.addEventListener('touchstart', handleTouchStart, {passive: true});
        quizCard.addEventListener('touchend', handleTouchEnd, {passive: true});
        quizCard.addEventListener('mousedown', handleMouseDown);
        quizCard.addEventListener('mouseup', handleMouseUp);
    }
    
    function handleTouchStart(e) {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
    }
    
    function handleTouchEnd(e) {
        if (!startX || !startY) return;
        
        const endX = e.changedTouches[0].clientX;
        const endY = e.changedTouches[0].clientY;
        
        const diffX = startX - endX;
        const diffY = startY - endY;
        
        // التأكد من أن الحركة أفقية أكثر من عمودية
        if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
            if (diffX > 0) {
                // swipe left - التالي
                if (currentStep < questionGroups.length - 1 && isCurrentStepAnswered()) {
                    showStep(currentStep + 1);
                }
            } else {
                // swipe right - السابق
                if (currentStep > 0) {
                    showStep(currentStep - 1);
                }
            }
        }
        
        startX = 0;
        startY = 0;
    }
    
    function handleMouseDown(e) {
        startX = e.clientX;
        startY = e.clientY;
    }
    
    function handleMouseUp(e) {
        if (!startX || !startY) return;
        
        const endX = e.clientX;
        const endY = e.clientY;
        
        const diffX = startX - endX;
        const diffY = startY - endY;
        
        if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
            if (diffX > 0) {
                if (currentStep < questionGroups.length - 1 && isCurrentStepAnswered()) {
                    showStep(currentStep + 1);
                }
            } else {
                if (currentStep > 0) {
                    showStep(currentStep - 1);
                }
            }
        }
        
        startX = 0;
        startY = 0;
    }

    // إظهار سؤال واحد فقط عند بدء الصفحة
    if (questionGroups.length > 0) {
        showStep(0);
    }
}

// ===== صفحة التحميل =====
function showLoadingScreen() {
    // إخفاء النموذج
    const quizScreen = document.getElementById('quiz-screen');
    if (quizScreen) {
        quizScreen.style.display = 'none';
    }
    
    // إنشاء صفحة التحميل
    const container = document.querySelector('.container');
    const loadingScreen = document.createElement('div');
    loadingScreen.className = 'loading-screen';
    loadingScreen.innerHTML = `
        <div class="loading-content">
            <div class="loading-spinner">
                <div class="coffee-cup">☕</div>
            </div>
            <h2>جاري تحليل تفضيلاتك...</h2>
            <p>نحن نعمل على اكتشاف أفضل قهوة تناسب ذوقك</p>
            <div class="loading-steps">
                <div class="step active">تحليل مستوى الحلاوة</div>
                <div class="step">تحليل كمية الحليب</div>
                <div class="step">تحليل قوة القهوة</div>
                <div class="step">تحليل النكهات المفضلة</div>
                <div class="step">تحليل درجة الحرارة</div>
                <div class="step">إعداد التوصية النهائية</div>
            </div>
        </div>
    `;
    
    container.appendChild(loadingScreen);
    
    // محاكاة عملية التحميل
    const steps = loadingScreen.querySelectorAll('.step');
    let currentStep = 0;
    
    const loadingInterval = setInterval(() => {
        if (currentStep < steps.length) {
            steps[currentStep].classList.add('active');
            currentStep++;
        } else {
            clearInterval(loadingInterval);
            // الانتقال لصفحة النتيجة بعد انتهاء التحميل
            setTimeout(() => {
                window.location.href = 'result.html';
            }, 1000);
        }
    }, 800);
}

// ===== إعدادات الصفحة =====
document.addEventListener('DOMContentLoaded', function() {
    // تحديد نوع الصفحة
    const currentPage = window.location.pathname.split('/').pop() || 'welcome.html';
    
    if (currentPage === 'quiz.html') {
        // صفحة الاختبار
        setupQuizPage();
    } else if (currentPage === 'result.html') {
        // صفحة النتيجة
        displayRecommendation();
    }
    // صفحة الترحيب لا تحتاج إعدادات خاصة
});

