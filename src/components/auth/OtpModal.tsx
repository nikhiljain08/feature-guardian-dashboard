
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface OtpModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onVerify: (otp: string) => void;
  isLoading: boolean;
}

const OtpModal = ({ open, onOpenChange, onVerify, isLoading }: OtpModalProps) => {
  const [otp, setOtp] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onVerify(otp);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Two-Factor Authentication</DialogTitle>
          <DialogDescription>
            Enter the one-time password sent to your device to complete login
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="otp">One-Time Password</Label>
            <Input
              id="otp"
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
              className="text-center text-lg tracking-widest"
              autoFocus
              disabled={isLoading}
              required
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" type="button" onClick={() => onOpenChange(false)} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={otp.length < 6 || isLoading}>
              {isLoading ? "Verifying..." : "Verify"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default OtpModal;
