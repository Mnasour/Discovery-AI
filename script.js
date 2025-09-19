

let userAnswers = {};
class CoffeeRecommendationModel {
   
    constructor() {
        // specialty: 0 = عادي, 1 = يمني, 2 = كولومبي, 3 = إثيوبي
        this.drinksData = [
            // المشروبات الباردة (Cold Drinks - temperature = 0)
            {name: 'v60 Yemeni coffee', sweetness: 0, milk_amount: 0, coffee_strength: 1, specialty: 1, temperature: 0},
            {name: 'v60 Ethiopian coffee', sweetness: 0, milk_amount: 0, coffee_strength: 1, specialty: 3, temperature: 0},
            {name: 'v60 Colombian coffee', sweetness: 0, milk_amount: 0, coffee_strength: 1, specialty: 2, temperature: 0},
            {name: 'Spanish latte', sweetness: 1, milk_amount: 1, coffee_strength: 1, specialty: 0, temperature: 0},
            {name: 'latte', sweetness: 0, milk_amount: 1, coffee_strength: 0, specialty: 0, temperature: 0},
            {name: 'Cold Brew', sweetness: 0, milk_amount: 0, coffee_strength: 1, specialty: 0, temperature: 0},
            {name: 'coffee day', sweetness: 0, milk_amount: 0, coffee_strength: 0, specialty: 0, temperature: 0},
            {name: 'Americano', sweetness: 0, milk_amount: 0, coffee_strength: 0, specialty: 0, temperature: 0},
            
            // المشروبات الساخنة (Hot Drinks - temperature = 1)
            {name: 'v60 Yemeni coffee', sweetness: 0, milk_amount: 0, coffee_strength: 1, specialty: 1, temperature: 1},
            {name: 'v60 Ethiopian coffee', sweetness: 0, milk_amount: 0, coffee_strength: 1, specialty: 3, temperature: 1},
            {name: 'v60 Colombian coffee', sweetness: 0, milk_amount: 0, coffee_strength: 1, specialty: 2, temperature: 1},
            {name: 'Spanish latte', sweetness: 1, milk_amount: 1, coffee_strength: 1, specialty: 0, temperature: 1},
            {name: 'Mikato', sweetness: 0, milk_amount: 1, coffee_strength: 1, specialty: 0, temperature: 1},
            {name: 'latte', sweetness: 0, milk_amount: 1, coffee_strength: 0, specialty: 0, temperature: 1},
            {name: 'Flat white', sweetness: 0, milk_amount: 1, coffee_strength: 0, specialty: 0, temperature: 1},
            {name: 'espresso', sweetness: 0, milk_amount: 0, coffee_strength: 1, specialty: 0, temperature: 1},
            {name: 'Cortado', sweetness: 0, milk_amount: 1, coffee_strength: 0, specialty: 0, temperature: 1},
            {name: 'coffee day', sweetness: 0, milk_amount: 0, coffee_strength: 0, specialty: 0, temperature: 1},
            {name: 'cappuccino', sweetness: 0, milk_amount: 1, coffee_strength: 0, specialty: 0, temperature: 1},
            {name: 'Americano', sweetness: 0, milk_amount: 0, coffee_strength: 0, specialty: 0, temperature: 1}
        ];
    }

    /**
     * حساب المسافة الإقليدية بين نقطتين
     * Calculate Euclidean distance between two points
     * @param {Object} point1 - النقطة الأولى (First point)
     * @param {Object} point2 - النقطة الثانية (Second point)
     * @returns {number} المسافة (Distance)
     */
    calculateDistance(point1, point2) {
        let distance = 0;
        const features = ['sweetness', 'milk_amount', 'coffee_strength', 'specialty', 'temperature'];
        
        for (let feature of features) {
            distance += Math.pow(point1[feature] - point2[feature], 2);
        }
        
        return Math.sqrt(distance);
    }

    /**
     * تحويل إجابات المستخدم إلى قيم رقمية
     * Convert user answers to numerical values
     * @param {Object} answers - إجابات المستخدم (User answers)
     * @returns {Object} القيم الرقمية (Numerical values)
     */
    convertAnswersToNumbers(answers) {
        // تحويل نوع القهوة المختصة إلى رقم
        // Convert specialty coffee type to number
        let specialtyValue = 0; // عادي (Regular)
        if (answers['specialty'] === 'يمني') specialtyValue = 1;
        else if (answers['specialty'] === 'كولومبي') specialtyValue = 2;
        else if (answers['specialty'] === 'إثيوبي') specialtyValue = 3;
        
        return {
            sweetness: answers['sweetness-level'] === 'نعم' ? 1 : 0,
            milk_amount: answers['milk-amount'] === 'نعم' ? 1 : 0,
            coffee_strength: answers['coffee-strength'] === 'نعم' ? 1 : 0,
            specialty: specialtyValue,
            temperature: answers['temperature'] === 'نعم' ? 0 : 1  // نعم = بارد = 0، لا = ساخن = 1
        };
    }

    /**
     * خوارزمية KNN للتنبؤ مع ترجيح الميزات
     * KNN prediction algorithm with feature weighting
     * @param {Object} userAnswers - إجابات المستخدم (User answers)
     * @param {number} k - عدد الجيران (Number of neighbors)
     * @returns {Object} نتيجة التنبؤ (Prediction result)
     */
    predict(userAnswers, k = 3) {
        const userPreferences = this.convertAnswersToNumbers(userAnswers);
        
        // حساب المسافات مع ترجيح الميزات المهمة
        // Calculate distances with feature weighting
        const distances = this.drinksData.map(drink => {
            let weightedDistance = 0;
            
            // ترجيح خاص لكل ميزة (كلما زاد الرقم، كلما كانت الميزة مهمة)
            // Feature weights (higher number = more important)
            const weights = {
                sweetness: 2,      // الحلاوة مهمة جداً (Sweetness very important)
                milk_amount: 3,    // كمية الحليب مهمة جداً جداً (Milk amount very very important)
                coffee_strength: 2, // قوة القهوة مهمة (Coffee strength important)
                specialty: 2,      // القهوة المختصة مهمة (Specialty coffee important)
                temperature: 2     // الحرارة مهمة (Temperature important)
            };
            
            // حساب المسافة الموزونة
            // Calculate weighted distance
            Object.keys(weights).forEach(feature => {
                const diff = Math.abs(userPreferences[feature] - drink[feature]);
                weightedDistance += diff * weights[feature];
            });
            
            return {
                drink: drink,
                distance: weightedDistance
            };
        });

        // ترتيب المشروبات حسب المسافة الموزونة (الأقرب أولاً)
        // Sort drinks by weighted distance (closest first)
        distances.sort((a, b) => a.distance - b.distance);

        // تفضيل صريح لشرط الحليب بناءً على اختيار المستخدم
        // Explicitly prefer milk condition based on user choice
        let bestMatchEntry = distances[0];
        if (userPreferences.milk_amount === 1) {
            const withMilk = distances.find(entry => entry.drink.milk_amount === 1);
            if (withMilk) bestMatchEntry = withMilk;
        } else if (userPreferences.milk_amount === 0) {
            const withoutMilk = distances.find(entry => entry.drink.milk_amount === 0);
            if (withoutMilk) bestMatchEntry = withoutMilk;
        }

        return {
            prediction: bestMatchEntry.drink.name,
            confidence: Math.max(0, 1 - (bestMatchEntry.distance / 10)), // تحويل المسافة إلى ثقة (0-1)
            allDistances: distances.slice(0, 5)  // أفضل 5 نتائج (Top 5 results)
        };
    }
}

// إنشاء نموذج عالمي
// Create global model instance
const aiModel = new CoffeeRecommendationModel();

/**
 * ===== دالة تحديد التوصيات باستخدام نموذج KNN =====
 * ===== Get recommendations using KNN model =====
 * @param {Object} answers - إجابات المستخدم (User answers)
 * @returns {Array} قائمة التوصيات (Recommendations list)
 */
function getRecommendations(answers) {
    // استخدام نموذج الذكاء الاصطناعي للتنبؤ
    // Use AI model for prediction
    const aiResult = aiModel.predict(answers);
    
    // الحصول على المشروب المقترح
    // Get predicted drink
    const predictedDrink = aiResult.prediction;
    
    // إنشاء التوصية مع الصورة والوصف
    // Create recommendation with image and description
    // استخدام تفضيل المستخدم للحرارة لتحديد الصورة
    // Use user temperature preference to determine image
    const recommendation = {
        name: getArabicDrinkName(predictedDrink, answers['temperature']),
        description: getDrinkDescription(predictedDrink, answers['temperature']),
        image: getDrinkImage(predictedDrink, answers['temperature'])
    };
    
    return [recommendation];
}

/**
 * ===== دالة تحويل اسم المشروب إلى العربية =====
 * ===== Convert drink name to Arabic =====
 * @param {string} drinkName - اسم المشروب بالإنجليزية (English drink name)
 * @param {string} temperature - درجة الحرارة (Temperature)
 * @returns {string} اسم المشروب بالعربية (Arabic drink name)
 */
function getArabicDrinkName(drinkName, temperature) {
    const isCold = temperature === 'نعم'; // نعم = بارد
    const tempText = isCold ? 'بارد' : 'ساخن';
    
    const arabicNames = {
        'espresso': `إسبريسو ${tempText}`,
        'Americano': `أمريكانو ${tempText}`,
        'latte': `لاتيه ${tempText}`,
        'cappuccino': `كابتشينو ${tempText}`,
        'Flat white': `فلات وايت ${tempText}`,
        'Cortado': `كورتادو ${tempText}`,
        'Spanish latte': `سبانش لاتيه ${tempText}`,
        'Mikato': `ميكاتو ${tempText}`,
        'Cold Brew': 'كولد برو بارد',
        'v60 Yemeni coffee': `قهوة v60 يمني ${tempText}`,
        'v60 Ethiopian coffee': `قهوة v60 إثيوبي ${tempText}`,
        'v60 Colombian coffee': `قهوة v60 كولومبي ${tempText}`,
        'coffee day': `قهوة اليوم ${tempText}`
    };
    
    return arabicNames[drinkName] || `مشروب ${tempText}`;
}

/**
 * ===== دالة الحصول على وصف المشروب =====
 * ===== Get drink description =====
 * @param {string} drinkName - اسم المشروب (Drink name)
 * @param {string} temperature - درجة الحرارة (Temperature)
 * @returns {string} وصف المشروب (Drink description)
 */
function getDrinkDescription(drinkName, temperature) {
    const isCold = temperature === 'نعم'; // نعم = بارد
    const tempText = isCold ? 'بارد' : 'ساخن';
    
    const descriptions = {
        'espresso': 'قهوة مركزة وقوية بدون حليب',
        'Americano': 'قهوة خفيفة مع ماء ساخن بدون حليب',
        'latte': 'قهوة خفيفة مع حليب فومي ناعم',
        'cappuccino': 'قهوة خفيفة مع حليب ورغوة متوازنة',
        'Flat white': 'قهوة خفيفة مع حليب حريري ناعم',
        'Cortado': 'إسبرسو ممزوج بكمية مساوية تقريباً من الحليب الساخن المبخر لتقليل حموضة القهوة أو مرارتها',
        'Spanish latte': 'مشروب مكون من الإسبريسو والحليب والثلج مضاف إليه محلى',
        'Mikato': 'اسبريسو مع رغوة الحليب فقط لتقليل حموضة القهوة أو مرارتها',
        'Cold Brew': 'قهوة باردة منقوعة طوال الليل بدون حليب',
        'v60 Yemeni coffee': `قهوة فاخرة ذات مذاق معتدل ومتوازن تحوي إيحاءات طبيعية من الياسمين والزبيب والفراولة`,
        'v60 Ethiopian coffee': `قهوة فاخرة ذات مذاق معتدل ومتوازن تحوي إيحاءات طبيعية من الفراولة والتوت البري والشوكولاتة`,
        'v60 Colombian coffee': `قهوة ذات مذاق معتدل وحدة متوسطة تحوي إيحاءات طبيعية من التوت الأزرق والفراولة`,
        'coffee day': 'قهوة سوداء فاخرة ذات سعر مميز مرشحة تجهز مسبقاً ويتم تقديمها بأنواع قهوة مختلفة يومياً حتى نفاذ الكمية'
    };
    
    return descriptions[drinkName] || 'مشروب رائع يناسب ذوقك';
}

/**
 * ===== دالة الحصول على صورة المشروب =====
 * ===== Get drink image path =====
 * @param {string} drinkName - اسم المشروب (Drink name)
 * @param {string} userTemperaturePreference - تفضيل المستخدم للحرارة (User temperature preference)
 * @returns {string} مسار الصورة (Image path)
 */
function getDrinkImage(drinkName, userTemperaturePreference) {
    // تحديد المجلد بناءً على تفضيل المستخدم للحرارة
    // Determine folder based on user temperature preference
    // نعم = بارد = مجلد cold (Yes = Cold = cold folder)
    // لا = ساخن = مجلد hot (No = Hot = hot folder)
    const folder = userTemperaturePreference === 'نعم' ? 'cold' : 'hot';
    
    // تنظيف اسم المشروب للبحث عن الصورة
    // Clean drink name for image search
    let imageName = drinkName.replace(/\s+/g, ' ').trim();
    
    // التأكد من وجود الصورة الصحيحة
    // Ensure correct image exists
    return `images/${folder}/${imageName}.png`;
}

/**
 * ===== دالة عرض النتيجة =====
 * ===== Display recommendation result =====
 */
function displayRecommendation() {
    // الحصول على إجابات المستخدم
    // Get user answers
    const answers = JSON.parse(localStorage.getItem('coffeeAnswers') || '{}');

    // تحديد التوصية بناءً على الإجابات
    // Determine recommendation based on answers
    const recommendations = getRecommendations(answers);
    
    
    // إنشاء حاوية التوصيات
    // Create recommendations container
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
                    <div class="coffee-description">
                        ${rec.description || ''}
                    </div>
                </div>
            `;
            recommendationContainer.appendChild(recCard);
        });
    }
}

/**
 * ===== دالة تحديث زر الإرسال =====
 * ===== Update submit button state =====
 */
function updateSubmitButton() {
    const allQuestions = ['sweetness-level', 'milk-amount', 'coffee-strength', 'specialty', 'temperature'];
    const allAnswered = allQuestions.every(question => userAnswers[question]);
    const submitBtn = document.getElementById('submit-btn');
    if (submitBtn) {
        submitBtn.disabled = !allAnswered;
    }
}

/**
 * ===== إعداد صفحة الاختبار =====
 * ===== Setup quiz page =====
 */
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

    /**
     * الحصول على مفتاح السؤال للمجموعة
     * Get question key for group
     * @param {Element} group - مجموعة السؤال (Question group)
     * @returns {string|null} مفتاح السؤال (Question key)
     */
    function getQuestionKeyForGroup(group) {
        const firstOption = group.querySelector('.option-btn');
        return firstOption ? firstOption.getAttribute('data-question') : null;
    }

    /**
     * التحقق من إجابة السؤال الحالي
     * Check if current step is answered
     * @returns {boolean} هل تم الإجابة (Is answered)
     */
    function isCurrentStepAnswered() {
        const group = questionGroups[currentStep];
        const key = getQuestionKeyForGroup(group);
        return key ? Boolean(userAnswers[key]) : true;
    }

    /**
     * تحديث حالة التنقل
     * Update navigation state
     */
    function updateNavState() {
        // تحديث أزرار التنقل
        // Update navigation buttons
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
        // Update progress bar and text
        if (totalStepsSpan) totalStepsSpan.textContent = questionGroups.length;
        const percent = ((currentStep) / (questionGroups.length - 1)) * 100;
        if (progressFill) progressFill.style.width = Math.max(0, Math.min(100, percent)) + '%';
        if (currentStepSpan) currentStepSpan.textContent = currentStep + 1;
    }

    /**
     * إعادة تعيين حالة الأزرار للسؤال الحالي
     * Reset button states for current question
     */
    function resetCurrentQuestionButtons() {
        const currentGroup = questionGroups[currentStep];
        if (!currentGroup) return;
        
        const key = getQuestionKeyForGroup(currentGroup);
        if (!key) return;
        
        // إزالة التحديد من جميع أزرار السؤال الحالي
        const currentButtons = currentGroup.querySelectorAll('.option-btn');
        currentButtons.forEach(btn => {
            btn.classList.remove('selected');
        });
        
        // إعادة تطبيق التحديد إذا كان هناك إجابة محفوظة
        if (userAnswers[key]) {
            const selectedButton = currentGroup.querySelector(`.option-btn[data-value="${userAnswers[key]}"]`);
            if (selectedButton) {
                selectedButton.classList.add('selected');
            }
        }
    }

    /**
     * إظهار خطوة معينة
     * Show specific step
     * @param {number} index - فهرس الخطوة (Step index)
     */
    function showStep(index) {
        if (index < 0 || index >= questionGroups.length) return;
        
        const currentGroup = questionGroups[currentStep];
        const nextGroup = questionGroups[index];
        
        if (currentGroup && nextGroup && currentStep !== index) {
            // تأثير انتقال سلس على السؤال فقط
            // Smooth transition effect on question only
            currentGroup.style.transition = 'opacity 0.2s ease, transform 0.2s ease';
            currentGroup.style.opacity = '0';
            currentGroup.style.transform = 'translateY(10px)';
            
            setTimeout(() => {
                // إخفاء السؤال الحالي وإظهار الجديد
                // Hide current question and show new one
                questionGroups.forEach((group, i) => {
                    group.style.display = i === index ? 'block' : 'none';
                });
                
                // إعداد السؤال الجديد للظهور
                // Prepare new question for appearance
                nextGroup.style.opacity = '0';
                nextGroup.style.transform = 'translateY(-10px)';
                
                // إظهار السؤال الجديد بسلاسة
                // Show new question smoothly
                setTimeout(() => {
                    nextGroup.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                    nextGroup.style.opacity = '1';
                    nextGroup.style.transform = 'translateY(0)';
                    
                    // إعادة تعيين الانتقالات
                    // Reset transitions
                    setTimeout(() => {
                        currentGroup.style.transition = '';
                        nextGroup.style.transition = '';
                    }, 300);
                }, 50);
            }, 200);
        } else {
            // نسخة احتياطية بدون تأثيرات
            // Fallback without effects
            questionGroups.forEach((group, i) => {
                group.style.display = i === index ? 'block' : 'none';
            });
        }

        currentStep = index;
        updateNavState();
        resetCurrentQuestionButtons();
    }
    
    // إضافة مستمعي الأحداث للأزرار
    // Add event listeners for buttons
    optionButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const question = this.getAttribute('data-question');
            const value = this.getAttribute('data-value');
            
            // التحقق من أن الزر محدد بالفعل
            // Check if button is already selected
            if (this.classList.contains('selected')) {
                // إلغاء التحديد
                // Deselect
                this.classList.remove('selected');
                delete userAnswers[question];
            } else {
                // إزالة التحديد من الأزرار الأخرى لنفس السؤال
                // Remove selection from other buttons for same question
                document.querySelectorAll(`.option-btn[data-question="${question}"]`).forEach(otherBtn => {
                    otherBtn.classList.remove('selected');
                });
                
                // تحديد الزر المختار
                // Select chosen button
                this.classList.add('selected');
                userAnswers[question] = value;
            }
            
            updateSubmitButton();
            // تحديث حالة الأزرار فور الاختيار
            // Update button state immediately after selection
            updateNavState();
        });
    });
    
    // زر التالي
    // Next button
    if (nextBtn) {
        nextBtn.addEventListener('click', function() {
            if (currentStep < questionGroups.length - 1) {
                showStep(currentStep + 1);
            }
        });
    }

    // زر السابق
    // Back button
    if (backBtn) {
        backBtn.addEventListener('click', function() {
            if (currentStep > 0) {
                showStep(currentStep - 1);
            }
        });
    }

    // إرسال النموذج
    // Form submission
    if (quizForm) {
        quizForm.addEventListener('submit', function(e) {
            e.preventDefault();
            if (Object.keys(userAnswers).length === 5) {
                // حفظ الإجابات
                // Save answers
                localStorage.setItem('coffeeAnswers', JSON.stringify(userAnswers));
                // عرض صفحة التحميل
                // Show loading screen
                showLoadingScreen();
            } else {
            }
        });
    }

    // إضافة دعم Swipe
    // Add swipe support
    if (quizCard) {
        quizCard.addEventListener('touchstart', handleTouchStart, {passive: true});
        quizCard.addEventListener('touchend', handleTouchEnd, {passive: true});
        quizCard.addEventListener('mousedown', handleMouseDown);
        quizCard.addEventListener('mouseup', handleMouseUp);
    }
    
    /**
     * بدء اللمس
     * Touch start
     * @param {TouchEvent} e - حدث اللمس (Touch event)
     */
    function handleTouchStart(e) {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
    }
    
    /**
     * انتهاء اللمس
     * Touch end
     * @param {TouchEvent} e - حدث اللمس (Touch event)
     */
    function handleTouchEnd(e) {
        if (!startX || !startY) return;
        
        const endX = e.changedTouches[0].clientX;
        const endY = e.changedTouches[0].clientY;
        
        const diffX = startX - endX;
        const diffY = startY - endY;
        
        // التأكد من أن الحركة أفقية أكثر من عمودية
        // Ensure movement is more horizontal than vertical
        if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
            if (diffX > 0) {
                // swipe left - التالي
                // swipe left - Next
                if (currentStep < questionGroups.length - 1 && isCurrentStepAnswered()) {
                    showStep(currentStep + 1);
                }
            } else {
                // swipe right - السابق
                // swipe right - Previous
                if (currentStep > 0) {
                    showStep(currentStep - 1);
                }
            }
        }
        
        startX = 0;
        startY = 0;
    }
    
    /**
     * بدء الضغط بالماوس
     * Mouse down
     * @param {MouseEvent} e - حدث الماوس (Mouse event)
     */
    function handleMouseDown(e) {
        startX = e.clientX;
        startY = e.clientY;
    }
    
    /**
     * انتهاء الضغط بالماوس
     * Mouse up
     * @param {MouseEvent} e - حدث الماوس (Mouse event)
     */
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
    // Show only one question when page loads
    if (questionGroups.length > 0) {
        showStep(0);
        resetCurrentQuestionButtons();
    }
}

/**
 * ===== صفحة التحميل =====
 * ===== Loading screen =====
 */
function showLoadingScreen() {
    // الانتقال إلى صفحة التحميل المخصصة
    // Navigate to dedicated loading page
    window.location.href = 'loading.html';
}

/**
 * ===== إعدادات الصفحة =====
 * ===== Page setup =====
 */
document.addEventListener('DOMContentLoaded', function() {
    // تحديد نوع الصفحة
    // Determine page type
    const currentPage = window.location.pathname.split('/').pop() || 'welcome.html';
    
    if (currentPage === 'quiz.html') {
        // صفحة الاختبار
        // Quiz page
        setupQuizPage();
    } else if (currentPage === 'result.html') {
        // صفحة النتيجة
        // Result page
        displayRecommendation();
    }
    // صفحة الترحيب لا تحتاج إعدادات خاصة
    // Welcome page doesn't need special setup
});