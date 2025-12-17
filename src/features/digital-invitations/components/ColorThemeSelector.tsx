import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Check, Loader2, Palette } from "lucide-react";
import { Button } from "@/components/ui/buttons/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/utils/card";
import { toast } from "@/hooks/ui/use-toast";
import {
  digitalInvitationService,
  ColorTheme,
} from "@/features/digital-invitations/services/digitalInvitationService";
import { cn } from "@/lib/utils";
import { getErrorMessage } from "@/lib/types";

interface ColorThemeSelectorProps {
  invitationId: number;
  disabled?: boolean;
}

export const ColorThemeSelector = ({
  invitationId,
  disabled = false,
}: ColorThemeSelectorProps) => {
  const queryClient = useQueryClient();
  const [selectedTheme, setSelectedTheme] = useState<string | null>(null);

  // Fetch current theme
  const { data: currentThemeData, isLoading } = useQuery({
    queryKey: ["invitation-theme", invitationId],
    queryFn: () => digitalInvitationService.getCurrentColorTheme(invitationId),
    enabled: !!invitationId,
  });

  const currentThemeKey = currentThemeData?.theme_key || "default";
  const availableThemes = currentThemeData?.available_themes || {};

  // Apply theme mutation
  const applyThemeMutation = useMutation({
    mutationFn: (themeKey: string) =>
      digitalInvitationService.applyColorTheme(invitationId, themeKey),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["invitation-theme", invitationId],
      });
      queryClient.invalidateQueries({ queryKey: ["invitation", invitationId] });
      toast({
        title: "Tema warna diterapkan",
        description: `Tema "${data.theme.name}" telah diterapkan ke undangan Anda`,
      });
      setSelectedTheme(null);
    },
    onError: (error: unknown) => {
      toast({
        title: "Gagal menerapkan tema",
        description: getErrorMessage(
          error,
          "Terjadi kesalahan saat menerapkan tema"
        ),
        variant: "destructive",
      });
    },
  });

  const handleApplyTheme = (themeKey: string) => {
    setSelectedTheme(themeKey);
    applyThemeMutation.mutate(themeKey);
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Tema Warna</CardTitle>
          <CardDescription>Memuat tema...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        </CardContent>
      </Card>
    );
  }

  const themeEntries = Object.entries(availableThemes);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Palette className="h-5 w-5" />
          Tema Warna
        </CardTitle>
        <CardDescription>
          Pilih tema warna untuk undangan Anda
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {themeEntries.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            Tidak ada tema warna tersedia untuk template ini
          </p>
        ) : (
          <>
            {themeEntries.map(([themeKey, theme]) => (
              <ThemeOption
                key={themeKey}
                themeKey={themeKey}
                theme={theme}
                isActive={currentThemeKey === themeKey}
                isApplying={
                  selectedTheme === themeKey && applyThemeMutation.isPending
                }
                onSelect={handleApplyTheme}
                disabled={disabled || applyThemeMutation.isPending}
              />
            ))}
          </>
        )}

        <div className="pt-3 border-t">
          <p className="text-xs text-muted-foreground">
            💡 <strong>Tips:</strong> Tema warna akan diterapkan ke seluruh
            undangan Anda
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

interface ThemeOptionProps {
  themeKey: string;
  theme: ColorTheme;
  isActive: boolean;
  isApplying: boolean;
  onSelect: (themeKey: string) => void;
  disabled: boolean;
}

const ThemeOption = ({
  themeKey,
  theme,
  isActive,
  isApplying,
  onSelect,
  disabled,
}: ThemeOptionProps) => {
  return (
    <button
      onClick={() => onSelect(themeKey)}
      disabled={disabled || isActive}
      className={cn(
        "w-full p-3 rounded-lg border-2 transition-all text-left",
        "hover:border-primary hover:bg-accent/5",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        isActive
          ? "border-primary bg-primary/5"
          : "border-border bg-background"
      )}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="font-medium text-sm">{theme.name}</span>
          {isActive && (
            <Check className="h-4 w-4 text-primary" aria-label="Tema aktif" />
          )}
        </div>
        {isApplying && <Loader2 className="h-4 w-4 animate-spin" />}
      </div>

      <div className="flex gap-2">
        <ColorSwatch color={theme.primary} label="Primary" />
        <ColorSwatch color={theme.secondary} label="Secondary" />
        <ColorSwatch color={theme.accent} label="Accent" />
        <ColorSwatch color={theme.background} label="Background" />
      </div>
    </button>
  );
};

interface ColorSwatchProps {
  color: string;
  label: string;
}

const ColorSwatch = ({ color, label }: ColorSwatchProps) => {
  return (
    <div className="flex flex-col items-center gap-1">
      <div
        className="w-8 h-8 rounded border border-gray-300 shadow-sm"
        style={{ backgroundColor: color }}
        title={`${label}: ${color}`}
      />
      <span className="text-[10px] text-muted-foreground">{label}</span>
    </div>
  );
};
