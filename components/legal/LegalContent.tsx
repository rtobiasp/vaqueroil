import SectionHeading from "@/components/shared/SectionHeading";
import Reveal from "@/components/animations/Reveal";

type LegalSection = {
  id: string;
  title: string;
  paragraphs: string[];
  list?: string[];
};

const sections: LegalSection[] = [
  {
    id: "titular",
    title: "1. Datos del titular",
    paragraphs: [
      "En cumplimiento del artículo 10 de la Ley 34/2002, de Servicios de la Sociedad de la Información y de Comercio Electrónico (LSSI-CE), se informa de que esta web es titularidad de Vaqueroil, taller de mantenimiento y reparación de vehículos situado en Logroño (La Rioja).",
      "Para cualquier cuestión relacionada con este sitio web o nuestros servicios puedes contactarnos en C. Calahorra, 12, Pab. 1, 26006 Logroño, en el teléfono 941 04 76 95 o en el correo info@vaqueroil.es.",
    ],
  },
  {
    id: "objeto",
    title: "2. Objeto y uso de la web",
    paragraphs: [
      "Esta web tiene como finalidad presentar los servicios del taller, facilitar la solicitud de citas y ofrecer información de contacto. Al navegar por ella aceptas estas condiciones de uso.",
      "Te comprometes a hacer un uso lícito de los contenidos, a no introducir datos falsos en el formulario de reserva y a no realizar acciones que puedan dañar la web o a terceros.",
    ],
  },
  {
    id: "propiedad",
    title: "3. Propiedad intelectual",
    paragraphs: [
      "Todos los contenidos de esta web (textos, imágenes, logotipos y diseño) son propiedad de Vaqueroil o se usan con licencia, y están protegidos por la normativa de propiedad intelectual. No está permitida su reproducción sin autorización expresa.",
    ],
  },
  {
    id: "responsabilidad",
    title: "4. Responsabilidad",
    paragraphs: [
      "Trabajamos para que la información de servicios, precios orientativos y horarios esté actualizada, pero puede sufrir variaciones. El presupuesto definitivo siempre se confirma de forma personalizada antes de cada reparación.",
      "No nos responsabilizamos de interrupciones temporales del servicio web por causas técnicas ni del uso indebido que terceros puedan hacer de los contenidos publicados.",
    ],
  },
  {
    id: "privacidad",
    title: "5. Política de privacidad",
    paragraphs: [
      "Cuando pides cita a través de nuestro formulario recogemos los datos necesarios para gestionar tu reserva: nombre, email, teléfono y datos del vehículo y del servicio solicitado. La base jurídica es la prestación del servicio que nos solicitas.",
      "Conservamos tus datos solo durante el tiempo necesario para gestionar la cita y cumplir las obligaciones legales (garantías, facturación). No cedemos tus datos a terceros salvo obligación legal.",
      "Puedes ejercer tus derechos de acceso, rectificación, supresión, oposición, limitación y portabilidad escribiendo a info@vaqueroil.es. También tienes derecho a reclamar ante la Agencia Española de Protección de Datos (www.aepd.es).",
    ],
    list: [
      "Responsable: Vaqueroil · C. Calahorra, 12, Pab. 1, 26006 Logroño",
      "Contacto de privacidad: info@vaqueroil.es · 941 04 76 95",
      "Finalidad: gestión de citas, presupuestos y comunicaciones del servicio",
      "Conservación: el tiempo necesario para la relación y los plazos legales",
    ],
  },
  {
    id: "cookies",
    title: "6. Política de cookies",
    paragraphs: [
      "Esta web utiliza cookies técnicas necesarias para su funcionamiento, como las de sesión y seguridad del área privada (proveedor: Supabase). Sin ellas, funciones como el inicio de sesión o la reserva de citas no estarían disponibles.",
      "El mapa de ubicación es un contenido incrustado de Google Maps que puede instalar cookies de terceros, por lo que solo se carga si lo aceptas: al entrar verás un aviso de cookies y, en la propia sección de ubicación, un botón para cargar el mapa. Si lo rechazas, el mapa no se carga y puedes localizarnos con la dirección indicada (C. Calahorra, 12, Logroño). No utilizamos cookies con fines publicitarios.",
      "Puedes cambiar tu elección en cualquier momento desde el enlace «Cookies» del pie de página, o bloquear y eliminar las cookies desde la configuración de tu navegador, aunque algunas funciones de la web podrían dejar de estar disponibles.",
    ],
  },
  {
    id: "jurisdiccion",
    title: "7. Legislación y jurisdicción",
    paragraphs: [
      "Estas condiciones se rigen por la legislación española. Para cualquier controversia relacionada con esta web o los servicios del taller, las partes se someten a los juzgados y tribunales de Logroño, salvo que la normativa de consumidores disponga otra cosa.",
      "Última actualización: septiembre de 2026.",
    ],
  },
];

export default function LegalContent() {
  return (
    <section className="bg-bg-dark bg-felt px-5 py-12 sm:px-8 sm:py-16 md:px-15 md:py-20">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-8">
        <SectionHeading
          title="AVISO LEGAL Y PRIVACIDAD"
          description="Quiénes somos, qué datos pedimos al reservar y qué derechos tienes."
        />

        <nav
          aria-label="Índice legal"
          className="flex flex-wrap gap-2 rounded-2xl bg-surface-mid p-4 sm:p-5"
        >
          {sections.map((section) => (
            <a
              key={section.id}
              href={`#${section.id}`}
              className="rounded-full border border-text-inverse/15 px-4 py-2 font-link text-xs uppercase tracking-wide text-text-inverse/75 transition-colors hover:border-accent-primary hover:text-accent-primary"
            >
              {section.title}
            </a>
          ))}
        </nav>

        <div className="flex flex-col gap-4">
          {sections.map((section) => (
            <Reveal key={section.id} y={22} duration={0.6}>
              <article
                id={section.id}
                className="scroll-mt-28 rounded-2xl bg-surface-mid p-6 text-text-inverse sm:p-8"
              >
              <h2 className="text-xl font-medium sm:text-2xl">
                {section.title}
              </h2>
              <div className="mt-4 flex flex-col gap-3 text-sm leading-relaxed text-text-inverse/75 sm:text-base">
                {section.paragraphs.map((paragraph, i) => (
                  <p key={i}>{paragraph}</p>
                ))}
              </div>
              {section.list ? (
                <ul className="mt-4 flex flex-col gap-2 rounded-xl bg-bg-dark/40 p-4 text-sm sm:text-base">
                  {section.list.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2 text-text-inverse/85"
                    >
                      <span
                        aria-hidden="true"
                        className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent-primary"
                      />
                      {item}
                    </li>
                  ))}
                </ul>
              ) : null}
              </article>
            </Reveal>
          ))}
        </div>

        <p className="text-center text-sm text-text-inverse/50">
          ¿Dudas? Escríbenos a{" "}
          <a
            href="mailto:info@vaqueroil.es"
            className="text-accent-primary underline"
          >
            info@vaqueroil.es
          </a>{" "}
          o llámanos al{" "}
          <a href="tel:+34941047695" className="text-accent-primary underline">
            941 04 76 95
          </a>
          .
        </p>
      </div>
    </section>
  );
}
