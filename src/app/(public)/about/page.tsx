export default function AboutPage() {
    return (
      <div className="py-16">
        {/* Header */}
        <section className="bg-gradient-to-br from-brand-600 to-brand-800 text-white py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-5xl lg:text-6xl font-black mb-4">من نحن</h1>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              تعرف على قصة Code Tech ورؤيتنا في عالم البرمجة
            </p>
          </div>
        </section>
  
        {/* المحتوى */}
        <section className="container mx-auto px-4 py-16 max-w-4xl">
          <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed space-y-6">
            <h2 className="text-3xl font-black text-brand-600 mb-4">قصتنا</h2>
            <p>
              <strong>Code Tech</strong> هي شركة برمجية يمنية متخصصة في بناء 
              وتطوير الأنظمة والتطبيقات ومواقع الويب. انطلقنا من صنعاء برؤية 
              واضحة: تقديم حلول برمجية احترافية بمعايير عالمية وبأسعار مناسبة.
            </p>
  
            <h2 className="text-3xl font-black text-brand-600 mt-10 mb-4">رؤيتنا</h2>
            <p>
              أن نكون الشركة الرائدة في مجال تطوير البرمجيات في اليمن والمنطقة 
              العربية، وأن نساهم في التحول الرقمي للمؤسسات والشركات.
            </p>
  
            <h2 className="text-3xl font-black text-brand-600 mt-10 mb-4">رسالتنا</h2>
            <p>
              تقديم حلول برمجية مبتكرة وعالية الجودة تلبي احتياجات عملائنا، 
              مع الالتزام بالمعايير الأخلاقية والمهنية.
            </p>
  
            <h2 className="text-3xl font-black text-brand-600 mt-10 mb-4">قيمنا</h2>
            <ul className="space-y-3 list-disc pr-6">
              <li><strong>الجودة:</strong> لا نساوم على الجودة أبداً</li>
              <li><strong>الشفافية:</strong> نتعامل بوضوح وصراحة مع عملائنا</li>
              <li><strong>الالتزام:</strong> نسلم مشاريعنا في الموعد المحدد</li>
              <li><strong>الابتكار:</strong> نواكب أحدث التقنيات العالمية</li>
              <li><strong>الدعم:</strong> نقف بجانب عملائنا بعد التسليم</li>
            </ul>
          </div>
        </section>
      </div>
    );
  }