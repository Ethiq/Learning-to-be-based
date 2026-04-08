'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { isAddress } from '@/lib/utils'

export function WalletSearch() {
  const router = useRouter()
  const [address, setAddress] = useState('')
  const [error, setError] = useState('')

  const handleSearch = () => {
    if (!isAddress(address)) {
      setError('Enter a valid Base address (0x...)')
      return
    }

    setError('')
    router.push(`/wallet/${address}`)
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-3 sm:flex-row">
        <Input
          placeholder="0x..."
          value={address}
          onChange={(e) => setAddress(e.target.value.trim())}
          aria-label="Wallet address"
        />
        <Button onClick={handleSearch}>Analyze Wallet</Button>
      </div>
      {error && <p className="text-sm text-rose-400">{error}</p>}
    </div>
  )
}
