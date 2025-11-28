import { NextRequest, NextResponse } from 'next/server'
import { saveReserva } from '@/lib/db'

export const dynamic = 'force-dynamic'

/**
 * ENDPOINT DE CHECKOUT DE PAGOS
 * 
 * Este endpoint maneja la creación de checkouts de pago.
 * 
 * INTEGRACIÓN CON MERCADOPAGO:
 * 1. Instalar SDK: npm install mercadopago
 * 2. Configurar credenciales en .env.local:
 *    MERCADOPAGO_ACCESS_TOKEN=tu_access_token
 *    MERCADOPAGO_PUBLIC_KEY=tu_public_key
 * 3. Reemplazar la sección "SIMULACIÓN" con:
 * 
 *    import { MercadoPagoConfig, Preference } from 'mercadopago'
 *    const client = new MercadoPagoConfig({ accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN! })
 *    const preference = new Preference(client)
 *    
 *    const preferenceData = {
 *      items: [{
 *        title: experienciaTitle,
 *        quantity: 1,
 *        unit_price: amount,
 *        currency_id: currency === 'USD' ? 'USD' : 'ARS',
 *      }],
 *      back_urls: {
 *        success: `${process.env.NEXT_PUBLIC_BASE_URL}/reservas?status=success`,
 *        failure: `${process.env.NEXT_PUBLIC_BASE_URL}/reservas?status=failure`,
 *        pending: `${process.env.NEXT_PUBLIC_BASE_URL}/reservas?status=pending`,
 *      },
 *      metadata: {
 *        userId,
 *        experienciaId,
 *        slot: JSON.stringify(slot),
 *      },
 *    }
 *    
 *    const response = await preference.create({ body: preferenceData })
 *    const redirectUrl = response.init_point
 * 
 * INTEGRACIÓN CON PAYPAL:
 * 1. Instalar SDK: npm install @paypal/checkout-server-sdk
 * 2. Configurar credenciales en .env.local:
 *    PAYPAL_CLIENT_ID=tu_client_id
 *    PAYPAL_CLIENT_SECRET=tu_client_secret
 *    PAYPAL_MODE=sandbox (o 'live' en producción)
 * 3. Reemplazar la sección "SIMULACIÓN" con:
 * 
 *    import paypal from '@paypal/checkout-server-sdk'
 *    const environment = new paypal.core.SandboxEnvironment(
 *      process.env.PAYPAL_CLIENT_ID!,
 *      process.env.PAYPAL_CLIENT_SECRET!
 *    )
 *    const client = new paypal.core.PayPalHttpClient(environment)
 *    
 *    const request = new paypal.orders.OrdersCreateRequest()
 *    request.prefer("return=representation")
 *    request.requestBody({
 *      intent: 'CAPTURE',
 *      purchase_units: [{
 *        amount: {
 *          currency_code: currency,
 *          value: amount.toString(),
 *        },
 *        description: experienciaTitle,
 *      }],
 *      application_context: {
 *        return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/reservas?status=success`,
 *        cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/reservas?status=cancelled`,
 *      },
 *    })
 *    
 *    const order = await client.execute(request)
 *    const redirectUrl = order.result.links.find((link: any) => link.rel === 'approve')?.href
 * 
 * INTEGRACIÓN CON STRIPE (para tarjetas internacionales / Israel):
 * 1. Instalar SDK: npm install stripe
 * 2. Configurar en .env.local:
 *    STRIPE_SECRET_KEY=tu_secret_key
 *    STRIPE_PUBLISHABLE_KEY=tu_publishable_key
 * 3. Reemplazar la sección "SIMULACIÓN" con:
 * 
 *    import Stripe from 'stripe'
 *    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2023-10-16' })
 *    
 *    const session = await stripe.checkout.sessions.create({
 *      payment_method_types: ['card'],
 *      line_items: [{
 *        price_data: {
 *          currency: currency.toLowerCase(),
 *          product_data: { name: experienciaTitle },
 *          unit_amount: Math.round(amount * 100), // Stripe usa centavos
 *        },
 *        quantity: 1,
 *      }],
 *      mode: 'payment',
 *      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/reservas?status=success`,
 *      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/reservas?status=cancelled`,
 *      metadata: {
 *        userId,
 *        experienciaId,
 *        slot: JSON.stringify(slot),
 *      },
 *    })
 *    
 *    const redirectUrl = session.url
 */

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      userId,
      userName,
      experienciaId,
      experienciaTitle,
      amount,
      currency = 'USD',
      method, // 'mercadopago' | 'paypal' | 'card' | 'stripe'
      slot,
    } = body

    if (!userId || !experienciaId || !amount || !method) {
      return NextResponse.json(
        { error: 'Faltan datos para procesar el pago' },
        { status: 400 }
      )
    }

    const now = Date.now()
    let redirectUrl: string | null = null
    let paymentId: string | null = null

    // ============================================
    // SECCIÓN DE INTEGRACIÓN CON PROVEEDORES REALES
    // ============================================
    // Reemplazar todo este bloque con el código del proveedor elegido (ver comentarios arriba)

    if (method === 'mercadopago') {
      // TODO: Integrar MercadoPago SDK aquí
      // const redirectUrl = await createMercadoPagoCheckout(...)
      // paymentId = response.id
      console.log('[SIMULACIÓN] MercadoPago checkout para', amount, currency)
    } else if (method === 'paypal') {
      // TODO: Integrar PayPal SDK aquí
      // const redirectUrl = await createPayPalCheckout(...)
      // paymentId = response.id
      console.log('[SIMULACIÓN] PayPal checkout para', amount, currency)
    } else if (method === 'card' || method === 'stripe') {
      // TODO: Integrar Stripe SDK aquí
      // const redirectUrl = await createStripeCheckout(...)
      // paymentId = session.id
      console.log('[SIMULACIÓN] Stripe checkout para', amount, currency)
    }

    // ============================================
    // FIN DE INTEGRACIÓN
    // ============================================

    // Crear reserva (en producción, crear primero como 'pending' y actualizar cuando el webhook confirme)
    const reserva = {
      id: now,
      userId,
      userName,
      experienciaId,
      experienciaTitle,
      amount,
      currency,
      method,
      slot,
      paymentId, // ID de la transacción del proveedor
      status: redirectUrl ? 'pending' : 'paid', // 'pending' si hay redirect, 'paid' si es simulado
      redirectUrl, // URL para redirigir al usuario al checkout
      createdAt: now,
    }

    const saved = saveReserva(reserva)

    return NextResponse.json({
      success: true,
      reserva: saved,
      redirectUrl, // Si hay redirectUrl, el frontend debe redirigir al usuario
    })
  } catch (error) {
    console.error('Error en POST /api/payments/checkout:', error)
    return NextResponse.json(
      { error: 'Error al procesar el pago' },
      { status: 500 }
    )
  }
}


