import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { record } = await req.json()
    
    // Create user profile
    const { error: profileError } = await supabaseClient
      .from('users')
      .insert({
        id: record.id,
        email: record.email,
        name: record.raw_user_meta_data?.name || 'User',
      })

    if (profileError) {
      console.error('Profile creation error:', profileError)
      throw profileError
    }

    // Create default user settings
    const { error: settingsError } = await supabaseClient
      .from('user_settings')
      .insert({
        user_id: record.id,
        focus_time: 25,
        short_break: 5,
        long_break: 15,
        auto_start: false,
        sound_enabled: true,
        fullscreen_mode: false,
        notification_sound: 'bell',
      })

    if (settingsError) {
      console.error('Settings creation error:', settingsError)
      throw settingsError
    }

    return new Response(
      JSON.stringify({ message: 'User profile and settings created successfully' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})