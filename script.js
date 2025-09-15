// ===== فنجان ديسكفري - موقع تحت الصيانة =====

// ===== متغيرات عامة =====
let userAnswers = {};

// ===== دالة عرض النتيجة =====
function displayRecommendation() {
    // دائماً نعرض "الموقع تحت الصيانة"
    const recommendation = {
        name: 'الموقع تحت الصيانة',
        description: 'نعتذر، الموقع حالياً تحت الصيانة. سنعود قريباً مع تحديثات جديدة!',
        emoji: '🔧'
    };
    
    // عرض الإيموجي بدلاً من الصورة
    const coffeeImage = document.getElementById('coffee-image');
    if (coffeeImage) {
        coffeeImage.style.display = 'none'; // إخفاء الصورة
        
        // إنشاء عنصر الإيموجي
        const emojiElement = document.createElement('div');
        emojiElement.className = 'coffee-emoji';
        emojiElement.textContent = recommendation.emoji;
        emojiElement.style.fontSize = '120px';
        emojiElement.style.margin = '0 auto 30px';
        emojiElement.style.display = 'block';
        
        // إضافة الإيموجي مكان الصورة
        coffeeImage.parentNode.insertBefore(emojiElement, coffeeImage);
    }
    
    // عرض اسم القهوة
    const coffeeName = document.getElementById('coffee-name');
    if (coffeeName) {
        coffeeName.textContent = recommendation.name;
    }
    
    // عرض وصف القهوة
    const coffeeDescription = document.getElementById('coffee-description');
    if (coffeeDescription) {
        coffeeDescription.textContent = recommendation.description;
    }
}

// ===== دالة تحديث زر الإرسال =====
function updateSubmitButton() {
    const allQuestions = ['sweetness-level', 'milk-amount', 'coffee-strength', 'flavors', 'temperature'];
    const allAnswered = allQuestions.every(question => userAnswers[question]);
    const submitBtn = document.getElementById('submit-btn');
    if (submitBtn) {
        submitBtn.disabled = !allAnswered;
    }
}

// ===== دالة إعادة تعيين الاختبار =====
function resetQuiz() {
    userAnswers = {};
    const submitBtn = document.getElementById('submit-btn');
    if (submitBtn) {
        submitBtn.disabled = true;
    }
    
    // إزالة التحديد من جميع الأزرار
    document.querySelectorAll('.option-btn').forEach(btn => {
        btn.classList.remove('selected');
    });
}

// ===== إعداد صفحة الاختبار =====
function setupQuizPage() {
    const optionButtons = document.querySelectorAll('.option-btn');
    const submitButton = document.getElementById('submit-btn');
    const quizForm = document.getElementById('coffee-quiz');
    
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
        });
    });
    
    if (quizForm) {
        quizForm.addEventListener('submit', function(e) {
            e.preventDefault();
            if (Object.keys(userAnswers).length === 5) {
                // حفظ الإجابات (رغم أن النتيجة ثابتة)
                localStorage.setItem('coffeeAnswers', JSON.stringify(userAnswers));
                // عرض صفحة التحميل
                showLoadingScreen();
            }
        });
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
